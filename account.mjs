import { JSONPreset } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default class Accounts {
    constructor() {
        this.db = null;
    }

    setup = async () => {
        const accounts = JSON.parse(fs.readFileSync("./seed.json", "utf-8"))
        const defaultData = { accounts };
        this.db = await JSONPreset("db.json", defaultData);
    };

    add = async ({ customerName, briefName, briefId, isActive }) => {
        const createdOn = new Date().toISOString();
        const data = {
            customerName,
            briefName,
            briefId,
            date: createdOn,
            isActive: !!isActive,
            id: uuidv4(),
        };
        this.db.data.accounts.push(data);
        await this.db.write();
        return data;
    };

    update = async (id, { customerName, briefName, briefId, isActive }) => {
        const account = this.getById(id);
        if (account) {
            if (customerName) account.customerName = customerName;
            if (briefName) account.briefName = briefName;
            if (briefId) account.briefId = briefId;
            if (typeof isActive === "boolean") account.isActive = isActive;
            this.db.data.accounts = this.db.data.accounts.map((el) => {
                if (el.id === id) {
                    return account;
                }
                return el;
            });
            // Save changes to the database
            await this.db.write();
            return account;
        }
        return null;
    };

    getAll = async (query) => {
        const {
            date = "",
            customerName = "",
            briefName = "",
            briefId,
            isActive,
            id,
        } = query || {};
        if (
            date ||
            customerName ||
            briefName ||
            briefId ||
            typeof isActive === "boolean" ||
            id
        ) {
            return this.db.data.accounts.filter((account) => {
                let isFound = true;
                if (new Date(account.date).getTime() > new Date(date).getTime()) {
                    isFound = false;
                }
                if (
                    String(customerName).toLowerCase() ===
                    String(account.customerName).toLowerCase()
                ) {
                    isFound = false;
                }
                if (
                    String(briefName).toLowerCase() ===
                    String(account.briefName).toLowerCase()
                ) {
                    isFound = false;
                }
                if (String(briefId) === String(account.briefId)) {
                    isFound = false;
                }
                if (typeof isActive === "boolean" && account.isActive !== isActive) {
                    isFound = false;
                }
                if (String(id) === String(account.id)) {
                    isFound = false;
                }
                return isFound;
            });
        }
        return this.db.data.accounts;
    };

    getById = (id) => {
        return this.db.data.accounts.find((account) => account.id === id);
    };
}