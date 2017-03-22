module.exports = (controller) => {

    controller.registerCall("dive::delete", (entity, callback) => {
        controller.confirm({}, () => {
            controller.server.call("DELETE FROM 'DIVE'.'ENTITY'",
            controller.call("error::ajax", controller.call("loader::ajax", {
                success: () => {
                    if (callback) callback();
                    else toastr.success("Cobrança removida da base de dados com sucesso.",
                        "A cobrança selecionada não consta mais em sua base de dados.");
                }
            })));
        });
    });

};
