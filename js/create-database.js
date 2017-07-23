
module.exports = function(cloudant, name, designDocs){

    return new Promise((resolve, reject) => {
        cloudant.db.create(name, err => {
            if(err) return reject(err)

            const db = cloudant.db.use(name)
            const security = {
                nobody: '_reader'
            }
            db.set_security(security, err => {
                if(err) return reject(err)

                db.bulk({docs:designDocs}, (err) => {
                    if(err) return reject(err)

                    resolve()
                })
            })
        })
    })
}
