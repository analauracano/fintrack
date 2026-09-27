import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middleware/error.middleware";

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Já existe um usuário com este e-mail.", 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return buildAuthResponse(user.id, user.email, user.name);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  return buildAuthResponse(user.id, user.email, user.name);
}

export async function refreshUserToken(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Refresh token inválido ou expirado.", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new AppError("Usuário não encontrado.", 401);
  }

  return buildAuthResponse(user.id, user.email, user.name);
}

function buildAuthResponse(id: string, email: string, name: string) {
  const accessToken = signAccessToken({ sub: id, email });
  const refreshToken = signRefreshToken({ sub: id, email });
  return {
    user: { id, name, email },
    accessToken,
    refreshToken,
  };
}
