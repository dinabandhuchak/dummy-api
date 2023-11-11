import express from "express";
import cors from "cors";
import Account from "./account.mjs";

async function main() {
    try {
        const account = new Account();
        await account.setup();

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());

        app.get(
            "/api/v1/accounts/search",
            async (req, res) => {
                const query = {};
                if (req.query?.id) query.id = req.query?.id;
                if (req.query?.customerName) query.customerName = req.query?.customerName;
                if (req.query?.briefName) query.briefName = req.query?.briefName;
                if (req.query?.briefId) query.briefId = req.query?.briefId;
                if (typeof req.query?.isActive === "boolean") query.isActive = req.query?.isActive;
                const accounts = await account.getAll(query);
                res.send({
                    accounts,
                    totalCount: accounts.length
                });
            }
        );

        app.get(
            "/api/v1/accounts/:id",
            (req, res) => {
                const acc = account.getById(req.params.id);
                res.send(acc);
            }
        );

        app.post(
            "/api/v1/accounts",
            async (req, res) => {
                if (!req.body?.customerName) return res.status(422).send("Please provide customerName");
                if (!req.body?.briefName) return res.status(422).send("Please provide briefName");
                if (!req.body?.briefId) return res.status(422).send("Please provide briefId");
                if (typeof req.body?.isActive !== "boolean") return res.status(422).send("Please provide isActive");

                const acc = await account.add({
                    customerName: req.body.customerName,
                    briefName: req.body.briefName,
                    briefId: req.body.briefId,
                    isActive: req.body.isActive,
                });
                res.send(acc);
            }
        );

        app.patch(
            "/api/v1/accounts/:id",
            async (req, res) => {
                if (!req.body?.customerName) return res.status(422).send("Please provide customerName");
                if (!req.body?.briefName) return res.status(422).send("Please provide briefName");
                if (!req.body?.briefId) return res.status(422).send("Please provide briefId");
                if (typeof req.body?.isActive !== "boolean") return res.status(422).send("Please provide isActive");
                const acc = await account.update(
                    req.params.id,
                    {
                        customerName: req.body.customerName,
                        briefName: req.body.briefName,
                        briefId: req.body.briefId,
                        isActive: req.body.isActive,
                    }
                );
                res.send(acc);
            }
        );

        app.listen(3000, () => {
            console.log("Server listening on 3000");
        })
    } catch (error) {
        console.error("ERROR:::", error);
    }
}

main();