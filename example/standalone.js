const { OpenApi } = require('../dist')

OpenApi.init('./petstore.json').then(binding => {
    binding.query.findPetsByStatus({ status: "available"}, {}, '{ id name }').then(
        res => console.log(res))
})