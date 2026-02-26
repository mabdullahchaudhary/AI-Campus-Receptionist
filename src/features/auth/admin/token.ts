export interface AdminTokenPayload {
    id: string;
    email: string;
    name: string;
    exp: number;
}

export function verifyAdminToken(token: string | undefined | null): AdminTokenPayload | null {
    if (!token) return null;
    try {
        const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as AdminTokenPayload;
        if (!decoded.exp || decoded.exp < Date.now()) return null;
        if (!decoded.id || !decoded.email) return null;
        return decoded;
    } catch {
        return null;
    }
}

