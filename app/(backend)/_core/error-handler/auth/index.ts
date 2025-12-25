import { UserRole } from "@/app/generated/prisma/enums";
import { ApiErrors } from "../../errors/api-error";
import { User } from "@/app/generated/prisma/browser";
import { AUTH_TOKEN } from "@/constants/keys";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import sendResponse from "../../shared/api-response";
import { redirect } from "next/navigation";

export class Auth {
  private static instance: Auth;
  private readonly JWT_SECRET: unknown = process.env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN: unknown = process.env.JWT_EXPIRES_IN;

  private constructor() {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw ApiErrors.InternalServerError(
        "JWT_SECRET OR JWT_EXPIRES_IN  not found in environment variables"
      );
    }
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  /**
   * Singleton pattern implementation
   * @returns AuthenticationService instance
   */
  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  private tryCatchWrapper = async (fn: Function, ...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      // await this.redirectAndClearCookies();
      throw ApiErrors.Unauthorized("Invalid or expired token");
    }
  };

  /**
   * Create a JWT token with user payload
   * @param payload - User data to include in token
   * @param expiresIn - Token expiration time
   * @returns Generated JWT token
   */
  public createToken(payload: Record<string, any>): string {
    if (!this.JWT_SECRET || !this.JWT_EXPIRES_IN) {
      throw ApiErrors.InternalServerError(
        "JWT_SECRET OR JWT_EXPIRES_IN not configured properly"
      );
    }
    const options: jwt.SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as any,
    };
    const token = jwt.sign(payload, this.JWT_SECRET as string, options);
    return token;
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   */
  public verifyToken(token: string) {
    return this.tryCatchWrapper(() => {
      const payload = jwt.verify(token, this.JWT_SECRET as string);

      return payload;
    });
  }

  /**
   * Get current authenticated user from request
   * @returns User object or null if not authenticated
   */
  public async getCurrentUser(): Promise<User | null> {
    return this.tryCatchWrapper(async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_TOKEN)?.value;

      if (!token) {
        await this.redirectAndClearCookies();
        return null;
      }

      const payload = await this.verifyToken(token);

      return payload;
    });
  }

  /**
   * Require authentication - throws error if user is not authenticated
   * @returns Authenticated user
   */
  public async requireAuth(): Promise<User | null | any> {
    const user = await this.getCurrentUser();

    if (!user) {
      await this.redirectAndClearCookies();
      return null;
    }

    return user;
  }

  /**
   * Check if user has required role
   * @param user - User to check
   * @param requiredRole - Required role
   * @returns Boolean indicating if user has role
   */
  public hasRole(user: User, requiredRole: UserRole): boolean {
    if (!user || !user.role) {
      return false;
    }
    return user.role === requiredRole;
  }

  /**
   * Check if user has any of the required roles
   * @param user - User to check
   * @param requiredRoles - Array of acceptable roles
   * @returns Boolean indicating if user has any of the roles
   */
  public hasAnyRole(user: User, requiredRoles: UserRole[]): boolean {
    if (!user || !user.role) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }

  /**
   * Require specific role - throws error if user doesn't have role
   * @param requiredRole - Required role
   * @returns Authenticated user with required role
   */
  public async requireRole(requiredRole: UserRole): Promise<User> {
    const user = await this.requireAuth();

    if (!this.hasRole(user, requiredRole)) {
      throw ApiErrors.Forbidden(`${requiredRole} role required`);
    }

    return user;
  }

  /**
   * Require any of the specified roles
   * @param requiredRoles - Array of acceptable roles
   * @returns Authenticated user with one of the required roles
   */
  public async requireAnyRole(requiredRoles: UserRole[]): Promise<User> {
    const user = (await this.requireAuth()) as User;

    if (!this.hasAnyRole(user, requiredRoles)) {
      throw ApiErrors.Forbidden(
        `One of the following roles required: ${requiredRoles.join(", ")}`
      );
    }

    return user;
  }

  public async requireSuperAdmin(): Promise<User> {
    const user = await this.requireAuth();
    if (!this.hasRole(user, UserRole.super_admin)) {
      throw ApiErrors.Forbidden(`Super Admin role required`);
    }
    return user;
  }

  /**
   * Set authentication cookies
   * @param response - NextResponse object
   * @param token - Access token
   * @param refreshToken - Refresh token
   */
  public async setAuthCookies(
    res: NextResponse,
    token: string
  ): Promise<NextResponse> {
    res.cookies.set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  }

  public async redirectAndClearCookies() {
    // We cannot call cookieStore.delete() here if this is called from a Layout.
    // Instead, we redirect to our specialized API route.
    // redirect("/login");
  }
}

// Export singleton instance for easy access
export const AuthUtils = Auth.getInstance();

// Legacy function exports for backward compatibility
export function requireAuth(): Promise<User | null | any> {
  return AuthUtils.requireAuth() as Promise<User>;
}

export async function getCurrentUser(): Promise<User | null> {
  return AuthUtils.getCurrentUser();
}

export function verifyToken(token: string): any {
  return AuthUtils.verifyToken(token);
}

export function isSuperAdmin(): boolean {
  const user = AuthUtils.getCurrentUser() as unknown as User;
  return AuthUtils.hasRole(user, UserRole.super_admin);
}

export function RequireSuperAdmin(): Promise<User> {
  return AuthUtils.requireSuperAdmin();
}

export function getCurrentUserAsync(): Promise<User | null> {
  return AuthUtils.getCurrentUser();
}
