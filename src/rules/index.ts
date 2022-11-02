import apiMethodsShouldSpecifyApiResponse from './api-method-should-specify-api-response/apiMethodsShouldSpecifyApiResponse';
import allPropertiesAreWhitelisted from './all-properties-are-whitelisted/allPropertiesAreWhitelisted';
import validateNonPrimitiveNeedsDecorators from './validated-non-primitive-property-needs-type-decorator/validateNonPrimitiveNeedsDecorators';

const allRules = {
  'api-method-should-specify-api-response': apiMethodsShouldSpecifyApiResponse,
  'all-properties-are-whitelisted': allPropertiesAreWhitelisted,
  'validated-non-primitive-property-needs-type-decorator':
    validateNonPrimitiveNeedsDecorators,
};

export default allRules;
