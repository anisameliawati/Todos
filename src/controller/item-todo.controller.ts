import { NextFunction, Request, Response } from "express";
import { ReqUser } from "../middleware/auth-middleware";
import { prisma } from "..";
import { Prisma } from "@prisma/client";

export const itemcontroller = {
  async createItem(req: ReqUser, res: Response, next: NextFunction) {
    try {
      await prisma.$transaction(async (prisma) => {
        const { name, is_done, check_list_id } = req.body;
        const newItem: Prisma.itemCreateInput = {
          name,
          is_done,
          check_list: {
            connect: {
              id: check_list_id,
            },
          },
        };
        await prisma.item.create({
          data: newItem,
        });
      });
      res.send({
        success: true,
        message: "data berhasil ditambahkan",
      });
    } catch (error) {
      next(error);
    }
  },
  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await prisma.item.findMany({
        include: {
          sub_item: {
            select: {
              name: true,
              is_done: true,
            },
          },
        },
      });
      res.send({
        result: items,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
  async getItemDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await prisma.item.findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          name: true,
          is_done: true,
          sub_item: {
            select: {
              name: true,
              is_done: true,
            },
          },
        },
      });
      res.send({
        success: true,
        result: item,
      });
    } catch (error) {
      next(error);
    }
  },
  async editItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, is_done } = req.body;
      const edit: Prisma.itemUpdateInput = {
        name,
        is_done,
      };

      await prisma.item.update({
        where: {
          id: req.params.id,
        },
        data: edit,
      });
      res.send({
        success: true,
        message: "data berhasil diedit",
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const check = await prisma.item.findFirst({
        where: {
          id: req.params.id,
        },
      });
      if (check) {
        await prisma.sub_item.deleteMany({
          where: { id: check.id },
        });
        await prisma.item.delete({
          where: {
            id: req.params.id,
          },
        });
      }

      res.send({
        success: true,
        message: "data berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
