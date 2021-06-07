const tenantRouter = require("express").Router();
const TenantController = require("../controllers/tenantController.js")

tenantRouter.post('/', TenantController.addTenant)

tenantRouter.get('/', TenantController.getTenant)

tenantRouter.get('/:id', TenantController.getTenantId)

tenantRouter.put('/:id', TenantController.putTenantId)

tenantRouter.patch('/:id', TenantController.patchTenantsId)

tenantRouter.delete('/:id', TenantController.deleteTenantId)

module.exports = tenantRouter