import e from '../library/server-communication/exception-dictionary';

module.exports = controller => {

    const logout = () => controller.call('authentication::logout');

    controller.registerCall('error::server', (exceptionType, exceptionMessage, exceptionCode, push) => {
        switch (exceptionCode) {
        case e.ExceptionDatabase.authenticationFailure:
        case e.ExceptionDatabase.blockedUser:
        case e.ExceptionDatabase.invalidTokenExpired:
        case e.ExceptionDatabase.invalidToken:
            controller.confirm({
                icon: 'fail',
                title: 'Whops! Teremos de autenticá-lo novamente.',
                subtitle: 'Por razões de segurança será necessário que se autentique novamente no sistema.',
                paragraph: 'Você será redirecionado para que possa realizar novamente a autenticação.',
                confirmText: 'Sair'
            }, logout, () => {});
            return;
        case e.ExceptionDatabase.missingBillingInformation:
            controller.confirm({
                icon: 'fail',
                title: 'Sem informações de bilhetagem.',
                subtitle: 'Você não possui informações de bilhetagem para continuar.',
                paragraph: 'Registre suas informações de bilhetagem e tente novamente.',
                confirmText: 'Informações de Bilhetagem'
            }, () => {
                controller.call('billingInformation::force');
            });
            return;
        case e.ExceptionDatabase.insufficientFunds:
            controller.confirm({
                icon: 'fail',
                title: 'Sem créditos suficientes.',
                subtitle: 'Você não possui créditos suficientes para continuar.',
                paragraph: 'Recarregue sua conta para poder usufruir dessa funcionalidade.',
                confirmText: 'Recarregar'
            }, () => {
                controller.call('credits::buy');
            });
            return;
        }

        if (exceptionMessage) {
            toastr.error(exceptionMessage);
            return;
        }

        if (push && exceptionMessage) {
            toastr.error(exceptionMessage);
            return;
        }

        toastr.error('Não foi possível processar a sua requisição.', 'Tente novamente mais tarde.');
    });

    controller.registerCall('error::ajax', (dict, enableMessage = true) => {
        const error = dict.error;
        dict.error = (jqXHR, ...args) => {
            try {
                const xml = $.parseXML(jqXHR.responseText);
                $.bipbopAssert(xml, dict.bipbopError || controller.reference('error::server'));
            } catch (err) {
                if (dict.bipbopError) dict.bipbopError(null, null, 0, false, null);
                if (enableMessage) toastr.error('Não foi possível processar a sua requisição.', 'Tente novamente mais tarde.');
            }

            if (error) {
                error(jqXHR, ...args);
            }

        };
        return dict;
    });

};
