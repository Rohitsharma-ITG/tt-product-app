export default class APIServices {

    async createCustomRestriction(payload) {
        const response = await fetch(`/api/custom-restriction/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const result = await response.json()
        return result
    }

    async updateCustomRestriction(payload) {
        const response = await fetch(`/api/custom-restriction/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const result = await response.json()
        return result
    }

    async deleteCustomRestriction(payload) {
        const response = await fetch(`/api/custom-restriction/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const result = await response.json()
        return result
    }

    async customRestrictionList(payload) {
        const response = await fetch(`/api/custom-restriction/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const result = await response.json()
        return result
    }

}
