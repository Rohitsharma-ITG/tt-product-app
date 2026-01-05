import { ErrorMessage, SuccessMessage, statusCode } from "../constant/messages.js";
import prisma from "../../db.server.js";




export const getCustomRestrictionList = async (details) => {
    try {
        const { page = 1, search, limit = 30 } = details;

        const pageNumber = Math.max(Number(page), 1);
        const skip = (pageNumber - 1) * limit;

        const where = search?.trim()
            ? {
                country: {
                    contains: search,
                    mode: "insensitive",
                },
            }
            : undefined;

        const [data, total] = await prisma.$transaction([
            prisma.country_taxes.findMany({
                where,
                orderBy: { created_at: "desc" },
                take: limit,
                skip,
            }),
            prisma.country_taxes.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            status: true,
            result: {
                data,
                pagination: {
                    currentPage: pageNumber,
                    limit: limit,
                    total: total,
                    totalPages: totalPages,
                    hasNext: pageNumber < totalPages,
                    hasPrevious: pageNumber > 1,
                },
            },
            messages: SuccessMessage.FETCHED,
        };
    } catch (error) {
        console.error("Error getting list:", error);
        return { status: false, message: "Error in getting list" };
    }
};

export const createCustomRestriction = async (detail) => {
    try {
        const { country, tax, tax_name, customs_limit, currency, is_eu = false, active = true } = detail;

        const countryTax = await prisma.country_taxes.create({
            data: {
                country,
                tax: parseFloat(tax),
                tax_name,
                is_eu,
                currency,
                customs_limit: parseFloat(customs_limit),
                active,
            }
        });

        return {
            status: true,
            result: countryTax,
            message: SuccessMessage.CREATED
        };

    } catch (error) {
        throw error
    }
}

export const updateCustomRestriction = async (detail) => {
    try {
        const { id, country, tax, tax_name, customs_limit, currency, is_eu, active } = detail;

        const found = await prisma.country_taxes.findFirst({ where: { id } })
        if (!found) {
            return {
                status: false,
                message: "Custom restriction not found",
                statusCode: statusCode.NOT_FOUND
            }
        }
        const countryTax = await prisma.country_taxes.update({
            where: { id: id },
            data: {
                country,
                tax: parseFloat(tax),
                tax_name,
                is_eu,
                currency,
                customs_limit: parseFloat(customs_limit),
                active,
            }
        });

        return {
            status: true,
            result: countryTax,
            message: SuccessMessage.UPDATED,
            statusCode: statusCode.OK
        };

    } catch (error) {
        throw error
    }
}

export const deleteCustomRestriction = async (id) => {
    try {
        const found = await prisma.country_taxes.findFirst({ where: { id } })
        if (!found) {
            return {
                status: false,
                message: "Custom restriction not found",
                statusCode: statusCode.NOT_FOUND
            }
        }
        await prisma.country_taxes.delete({
            where: { id: id }
        });

        return {
            status: true,
            message: SuccessMessage.DELETED,
            statusCode: statusCode.OK
        };

    } catch (error) {
        throw error
    }
}
