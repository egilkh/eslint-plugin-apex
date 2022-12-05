import apiMethodsShouldSpecifyApiResponse from './api-method-should-specify-api-response/apiMethodsShouldSpecifyApiResponse';
import classNamedGuardShouldHaveInjectableDecorator from './class-named-guard-should-have-injectable-decorator/classNamedGuardShouldHaveInjectableDecorator';
import classNamedServiceShouldHaveInjectableDecorator from './class-named-service-should-have-injectable-decorator/classNamedServiceShouldHaveInjectableDecorator';
import sequelizeTransactionsMustBeCommitted from './sequelize-transactions-must-be-committed/sequelizeTransactionsMustBeCommitted';

const allRules = {
  'api-method-should-specify-api-response': apiMethodsShouldSpecifyApiResponse,
  'class-named-service-should-have-injectable-decorator':
    classNamedServiceShouldHaveInjectableDecorator,
  'class-named-guard-should-have-injectable-decorator':
    classNamedGuardShouldHaveInjectableDecorator,
  'sequelize-transactions-must-be-committed':
    sequelizeTransactionsMustBeCommitted,
};

export default allRules;
