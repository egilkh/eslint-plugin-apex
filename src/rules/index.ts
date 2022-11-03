import allPropertiesAreWhitelisted from './all-properties-are-whitelisted/allPropertiesAreWhitelisted';
import apiMethodsShouldSpecifyApiResponse from './api-method-should-specify-api-response/apiMethodsShouldSpecifyApiResponse';
import classNamedGuardShouldHaveInjectableDecorator from './class-named-guard-should-have-injectable-decorator/classNamedGuardShouldHaveInjectableDecorator';
import classNamedServiceShouldHaveInjectableDecorator from './class-named-service-should-have-injectable-decorator/classNamedServiceShouldHaveInjectableDecorator';
import validateNonPrimitiveNeedsDecorators from './validated-non-primitive-property-needs-type-decorator/validateNonPrimitiveNeedsDecorators';

const allRules = {
  'api-method-should-specify-api-response': apiMethodsShouldSpecifyApiResponse,
  'all-properties-are-whitelisted': allPropertiesAreWhitelisted,
  'validated-non-primitive-property-needs-type-decorator':
    validateNonPrimitiveNeedsDecorators,
  'class-named-service-should-have-injectable-decorator':
    classNamedServiceShouldHaveInjectableDecorator,
  'class-named-guard-should-have-injectable-decorator':
    classNamedGuardShouldHaveInjectableDecorator,
};

export default allRules;
