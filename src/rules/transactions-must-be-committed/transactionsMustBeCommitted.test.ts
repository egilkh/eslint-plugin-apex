import { ESLintUtils } from '@typescript-eslint/utils';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './transactionsMustBeCommitted';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('transactions-must-be-committed', rule, {
  valid: [
    {
      code: `class TestClass {
                public create(dto: CreateDto): Promise<string[]> {
                    const transaction = await sequelize.transaction();
                    
                    const created = this.service.create(dto);
                    
                    await transaction.commit();
                    
                    return created;
                    try {
                    } catch (e) {
                        await transaction.rollback();
                        
                        throw e;
                    }
                }
            }`,
    },
    {
      code: `class TestClass {
                public create(dto: CreateDto, passedTransaction?: Transaction): Promise<string[]> {
                    const transaction = await sequelize.transaction({ transaction: passedTransaction });
                    
                    const created = this.service.create(dto);
                    
                    await transaction.commit();
                    
                    return created;
                    try {
                    } catch (e) {
                        await transaction.rollback();
                        
                        throw e;
                    }
                }
            }`,
    },
  ],
  invalid: [
    {
      code: `class TestClass {
                public create(dto: CreateDto): Promise<string[]> {
                    const transaction = await sequelize.transaction();
                    
                    const created = this.service.create(dto);
                    
                    return created;
                    try {
                    } catch (e) {
                        await transaction.rollback();
                        
                        throw e;
                    }
                }
            }`,
      errors: [
        {
          messageId: 'transactionsMustBeCommitted',
        },
      ],
    },
    {
      code: `class TestClass {
                public create(dto: CreateDto): Promise<string[]> {
                    const transaction = await sequelize.transaction();
                    
                    const created = this.service.create(dto);
                    
                    await transaction.commit();
                    
                    return created;
                    try {
                    } catch (e) {
                        throw e;
                    }
                }
            }`,
      errors: [
        {
          messageId: 'transactionsMustBeCommitted',
        },
      ],
    },
  ],
});
