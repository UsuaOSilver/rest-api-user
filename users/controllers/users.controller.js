// Controller hashes the password appropriately with definition below

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('based64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("based64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    UserModel.createUser(req.body).then((result) => { res.status(201).send({ id: result._id });});
};