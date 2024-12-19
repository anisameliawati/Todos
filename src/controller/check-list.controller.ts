import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { Prisma } from "@prisma/client";
import { ReqUser } from "../middleware/auth-middleware";

export const checklistController = {
  async createCheckList(req: ReqUser, res: Response, next: NextFunction) {
    try {
      await prisma.$transaction(async (prisma) => {
        const { name, image_url } = req.body;
        const newCheck: Prisma.check_listCreateInput = {
          name,
          image_url,
          user: {
            connect: {
              id: req.user?.id,
            },
          },
        };

        await prisma.check_list.create({
          data: newCheck,
        });

        res.send({
          success: true,
          message: "data berhasil ditambahkan",
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async getCheckList(req: Request, res: Response, next: NextFunction) {
    try {
      const checklist = await prisma.check_list.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      res.send({
        success: true,
        result: checklist,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCheckListDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const checkList = await prisma.check_list.findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          name: true,
          image_url: true,
          item: {
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
          },
        },
      });
      res.send({
        success: true,
        result: checkList,
      });
    } catch (error) {
      next(error);
    }
  },
  async editChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, image_url } = req.body;
      const edit: Prisma.check_listUpdateInput = {
        name,
        image_url,
      };

      await prisma.check_list.update({
        where: {
          id: req.params.id,
        },
        data: edit,
      });
      res.send({
        success: true,
        message: "data berhasil di edit",
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const check = await prisma.check_list.findFirst({
        where: {
          id: req.params.id,
        },
      });

      if (check)
        await prisma.sub_item.deleteMany({
          where: {
            item_id: check?.id,
          },
        });
      await prisma.item.deleteMany({
        where: {
          check_list_id: check?.id,
        },
      });
      await prisma.check_list.delete({
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
