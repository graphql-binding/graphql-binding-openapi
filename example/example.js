const { OpenApi } = require('../dist')

OpenApi.init('./petstore.json', 'http://petstore.swagger.io/v2').then(binding => {
    binding.query.findPetsByStatus({ status: "available"}, {}, '{ id name }').then(
        res => console.log(res))
})