import type { User, Team } from "@prisma/client";
import cuid from "cuid";
import { prisma } from "~/db.server";
import { getUniqueDiscrim } from "~/utils";

export type { Team } from "@prisma/client";

export async function transferTeam({
  id,
  userId,
  transferedId,
}: Pick<Team, "id"> & {
  userId: User["id"];
  transferedId: User["id"];
}) {
  const owner = await prisma.team.findFirst({
    where: {
      id,
      owner: {
        is: {
          id: userId,
        },
      },
    },
  });
  if (owner) {
    return prisma.team.update({
      where: {
        id,
      },
      data: {
        owner: {
          connect: {
            id: transferedId,
          },
        },
      },
    });
  } else {
    return false;
  }
}

export async function joinTeam({
  code,
  userId,
}: Pick<Team, "code"> & {
  userId: User["id"];
}) {
  const banned = await prisma.team.findFirst({
    where: {
      code,
      bannedUsers: {
        some: {
          id: userId,
        },
      },
    },
  });
  if (!banned) {
    return prisma.team.update({
      where: {
        code,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } else {
    return false;
  }
}

export function resetCode({
  id,
  userId,
}: Pick<Team, "id"> & {
  userId: User["id"];
}) {
  return prisma.team.updateMany({
    where: {
      id,
      users: {
        some: {
          id: userId,
        },
      },
    },
    data: {
      code: cuid(),
    },
  });
}

export function getTeamByNameDiscrim({
  name,
  discrim,
  userId,
}: Pick<Team, "name" | "discrim"> & {
  userId: User["id"];
}) {
  return prisma.team.findFirst({
    select: { id: true },
    where: {
      name,
      discrim,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
}

export function getTeam({
  id,
  userId,
}: Pick<Team, "id"> & {
  userId: User["id"];
}) {
  return prisma.team.findFirst({
    select: {
      id: true,
      discrim: true,
      name: true,
      users: true,
      owner: true,
      code: true,
    },
    where: {
      id,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
}

export function getTeamsBookmarks({ userId }: { userId: User["id"] }) {
  return prisma.team.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: { id: true, name: true, discrim: true, bookmarks: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getTeams({ userId }: { userId: User["id"] }) {
  return prisma.team.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: { id: true, name: true, users: true, discrim: true, owner: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createTeam({
  name,
  userId,
}: Pick<Team, "name"> & {
  userId: User["id"];
}) {
  const usedDiscrims = await prisma.team.findMany({
    where: {
      name,
    },
  });

  let discrim: number;

  if (usedDiscrims.length === 0) discrim = getUniqueDiscrim([]);
  else discrim = getUniqueDiscrim(usedDiscrims.map((team) => team.discrim));

  return prisma.team.create({
    data: {
      name,
      discrim,
      owner: {
        connect: {
          id: userId,
        },
      },
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function leaveTeam({
  id,
  userId,
}: Pick<Team, "id"> & { userId: User["id"] }) {
  return prisma.team.update({
    where: {
      id,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTeam({
  id,
  userId,
}: Pick<Team, "id"> & { userId: User["id"] }) {
  return prisma.team.deleteMany({
    where: {
      id,
      owner: {
        is: {
          id: userId,
        },
      },
    },
  });
}

export async function banUser({
  id,
  userId,
  bannedUserId,
}: Pick<Team, "id"> & { userId: User["id"]; bannedUserId: User["id"] }) {
  const owner = await prisma.team.findFirst({
    where: {
      id,
      owner: {
        is: {
          id: userId,
        },
      },
    },
  });
  if (owner) {
    await prisma.team.update({
      where: {
        id,
      },
      data: {
        bannedUsers: {
          connect: {
            id: bannedUserId,
          },
        },
        users: {
          disconnect: {
            id: bannedUserId,
          },
        },
      },
    });
  } else {
    return false;
  }
}

export async function kickUser({
  id,
  userId,
  kickedUserId,
}: Pick<Team, "id"> & { userId: User["id"]; kickedUserId: User["id"] }) {
  const owner = await prisma.team.findFirst({
    where: {
      id,
      owner: {
        is: {
          id: userId,
        },
      },
    },
  });
  if (owner) {
    await prisma.team.update({
      where: {
        id,
      },
      data: {
        users: {
          disconnect: {
            id: kickedUserId,
          },
        },
      },
    });
  } else {
    return false;
  }
}
