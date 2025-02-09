import { iCRUD } from "@models/iCRUD";
import prismaProvider from "@providers/prismaProvider";

export const categoriesSeed = [
	{ id: 1, title: "Animate" },
	{ id: 2, title: "Game Design" },
	{ id: 3, title: "Character Design" },
	{ id: 4, title: "Environment Design" },
	{ id: 5, title: "Programming" },
	{ id: 6, title: "Game Engine" },
	{ id: 7, title: "Web" },
	{ id: 8, title: "3D Modeling" },
	{ id: 9, title: "Texturing" },
	{ id: 10, title: "UI UX Design" },
	{ id: 11, title: "Sound and Music" },
	{ id: 12, title: "Narrative" },
];

export default class CategoryPrismaProvider implements iCRUD {
	async getSome() {
		try {
			const Categories = await prismaProvider.category.findMany();
			return Categories;
		} catch (error) {
			return "ERR";
		}
	}
	async getOne(id: number) {
		throw new Error("Method not implemented.");
	}
	async create(body: any) {
		throw new Error("Method not implemented.");
	}
	async update(id: number, body: any) {
		throw new Error("Method not implemented.");
	}
	async delete(id: number) {
		throw new Error("Method not implemented.");
	}

	async seed() {
		try {
			const categories = await prismaProvider.category.createMany({ data: categoriesSeed, skipDuplicates: true });
			return categories;
		} catch (error) {
			return "ERR";
		}
	}
}
