const Company = require('../models/pg/Company');

const DEFAULT_COMPANY_ID = '00000000-0000-4000-8000-000000000001';

async function getDefaultCompanyId(transaction) {
  const [company] = await Company.findOrCreate({
    where: { id: DEFAULT_COMPANY_ID },
    defaults: {
      name: 'Default Organization',
      subscriptionPlan: 'free',
      paymentStatus: 'active',
    },
    transaction,
  });

  return company.id;
}

module.exports = { getDefaultCompanyId, DEFAULT_COMPANY_ID };
