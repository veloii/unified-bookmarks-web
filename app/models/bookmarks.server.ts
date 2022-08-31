import type { User, Bookmark, Team } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Bookmark } from "@prisma/client";

export function getBookmark({
  id,
  userId,
}: Pick<Bookmark, "id"> & {
  userId: User["id"];
}) {
  return prisma.bookmark.findFirst({
    select: {
      id: true,
      name: true,
      link: true,
      updatedAt: true,
      createdBy: true,
    },
    where: {
      id,
      team: {
        is: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
  });
}

export function getBookmarks({
  userId,
  teamId,
}: {
  userId: User["id"];
  teamId: Team["id"];
}) {
  return prisma.bookmark.findMany({
    where: {
      team: {
        is: {
          id: teamId,
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
    select: { id: true, name: true, link: true, createdBy: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createBookmark({
  name,
  link,
  teamId,
  userId,
}: Pick<Bookmark, "name" | "teamId" | "link"> & {
  userId: User["id"];
}) {
  return prisma.bookmark.create({
    data: {
      name,
      link,
      team: {
        connect: {
          id: teamId,
        },
      },
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteBookmark({
  id,
  userId,
}: Pick<Bookmark, "id"> & { userId: User["id"] }) {
  return prisma.bookmark.deleteMany({
    where: {
      id,
      team: {
        is: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
  });
}

export async function editBookmark({
  id,
  name,
  link,
  teamId,
  userId,
}: Pick<Bookmark, "name" | "link" | "id"> & {
  userId: User["id"];
  teamId: Team["id"];
}) {
  const verify = await prisma.bookmark.findFirst({
    where: {
      id,
      team: {
        is: {
          id: teamId,
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
  });
  if (!verify) return false;

  return prisma.bookmark.update({
    where: {
      id,
    },
    data: {
      name,
      link,
    },
  });
}

export function getBookmarkByName({
  name,
  teamId,
  userId,
}: Pick<Bookmark, "name"> & { userId: User["id"]; teamId: Team["id"] }) {
  return prisma.bookmark.findFirst({
    where: {
      name,
      team: {
        is: {
          id: teamId,
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
  });
}
