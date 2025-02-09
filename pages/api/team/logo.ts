import { onErrorResponse, onSuccessResponse } from "@providers/apiResponseHandler";
import { formParser } from "@utilities/formParser";
import { NextApiRequest, NextApiResponse } from "next";
import webpSquareBuffer from "@providers/imageGenerators/webpSquare";
import { removeCookieToken, tokenValidator } from "@providers/tokenProvider";
import { teamLogoAWS } from "@providers/bucketsAWS/imageAWS";
import TeamPrismaProvider from "@providers/prismaProviders/teamPrisma";

export const config = {
	api: {
		bodyParser: false,
	},
};

const teamPrismaProvider = new TeamPrismaProvider();
export default async function teamLogoApi(req: NextApiRequest, res: NextApiResponse) {
	// add image
	if (req.method === "POST") {
		try {
			const token = tokenValidator(req?.cookies?.token as string);
			if (!token) {
				removeCookieToken({ req, res });
				return res.json(onErrorResponse("bad profile request"));
			}

			const { files, fields } = await formParser(req);
			if (!fields.id || !files.image) return res.json(onErrorResponse("incomplete team information"));

			// prisma check team manager
			const manager = await teamPrismaProvider.checkTeamManager({ teamId: parseInt(fields.id) });
			if (manager === "ERR") return res.json(onErrorResponse("error on team ORM"));
			if (manager === null) return res.json(onErrorResponse("this team not exist"));
			if (manager.managerId !== token.userId) return res.json(onErrorResponse("team err : access denied!"));

			// sharp
			const buffer = await webpSquareBuffer({ path: files.image.filepath });
			const fileName = fields.id + "." + buffer.info.format;

			// aws
			const awsRes = await teamLogoAWS({ file: buffer.data, fileName, ContentType: buffer.info.format });
			if (!awsRes) return res.json(onErrorResponse("error on aws"));

			// ok res
			return res.json(onSuccessResponse("ok"));
		} catch (error) {
			return res.json(onErrorResponse("err team logo"));
		}
	}

	// not supported method
	else {
		return res.json(onErrorResponse("not supported method"));
	}
}
