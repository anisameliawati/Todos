import { NextFunction, Request, Response } from "express";
import { ReqUser } from "../middleware/auth-middleware";
import { prisma } from "..";
import { Prisma } from "@prisma/client";

export const subItemController = {
  async createSubItem(req: ReqUser, res: Response, next: NextFunction) {
    try {
      await prisma.$transaction(async (prisma) => {
        const { name, is_done, item_id } = req.body;
        const newSub: Prisma.sub_itemCreateInput = {
          name,
          is_done,
          item: {
            connect: {
              id: item_id,
            },
          },
        };
        await prisma.sub_item.create({
          data: newSub,
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
  async getSubItems(req: Request, res: Response, next: NextFunction) {
    try {
      const subs = await prisma.sub_item.findMany({
        select: {
          name: true,
          is_done: true,
          id: true,
        },
      });
      res.send({
        success: true,
        result: subs,
      });
    } catch (error) {
      next(error);
    }
  },
  async getSubItemDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = await prisma.sub_item.findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          name: true,
          is_done: true,
        },
      });
      res.send({
        success: true,
        result: sub,
      });
    } catch (error) {
      next(error);
    }
  },
  async editSubItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, is_done } = req.body;
      const edit: Prisma.sub_itemUpdateInput = {
        name,
        is_done,
      };
      await prisma.sub_item.update({
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
  async deleteSubItem(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.sub_item.delete({
        where: {
          id: req.params.id,
        },
      });
      res.send({
        success: true,
        message: "data berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};
