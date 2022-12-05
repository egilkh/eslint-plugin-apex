import { ESLintUtils } from '@typescript-eslint/utils';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './sequelizeTransactionsMustBeCommitted';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2015,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

ruleTester.run('sequelize-transactions-must-be-committed', rule, {
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
    {
      code: `class TestClass {
                public create(dto: CreateDto, transaction?: Transaction): Promise<string[]> {
                
                functionCall(transaction);
                }
            }`,
    },
    {
      code: `class TestClass {
                  async read(fileId: FileId, transaction?: Transaction): Promise<File | null> {
                      if (!fileId) {
                        return null;
                      }

                      const readFile = await File.findByPk(fileId, {
                        include: [
                          {
                            model: Folder,
                            required: false,
                          },
                        ],
                        transaction,
                      });

                      if (!readFile) {
                        return null;
                      }

                      return readFile;
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
          messageId: 'sequelizeTransactionsMustBeCommitted',
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
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
  ],
});
