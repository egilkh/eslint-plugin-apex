import { RuleTester } from '@typescript-eslint/rule-tester';
import { getFixturesRootDirectory } from '../../testing/fixtureSetup';
import rule from './sequelizeTransactionsMustBeCommitted';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new RuleTester({
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
      // options transaction should be allowed to be passed
      code: `class TestClass {
                public create(dto: CreateDto, options?: CreateOptions): Promise<string[]> {
                
                functionCall(options?.transaction);
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
    {
      // should be valid to use transaction in sequelize call without committing in arrow function
      code: `
        const read = async (fileId: FileId, transaction?: Transaction): Promise<File | null> => {
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
      `,
    },
    {
      // should be valid to use contained transaction in arrow function
      code: `
        const create = async (dto: CreateDto): Promise<string[]> => {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        };
      `,
    },
    {
      // should be valid to use transaction with outer passed transaction in arrow function
      code: `
        const create = async (dto: CreateDto, passedTransaction?: Transaction): Promise<string[]> => {
            const transaction = await sequelize.transaction({ transaction: passedTransaction });
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        };
      `,
    },
    {
      // should be valid to pass a pass transaction to function without committing / rolling back in arrow function
      code: `
        const create = async (dto: CreateDto, transaction?: Transaction): Promise<string[]> => {
          functionCall(transaction);
        };
      `,
    },
    {
      // should be valid to use transaction in sequelize call without committing in function
      code: `
        async function read(fileId: FileId, transaction?: Transaction): Promise<File | null> {
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
      `,
    },
    {
      // should be valid to use contained transaction in function
      code: `
        async function create(dto: CreateDto): Promise<string[]> {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        };
      `,
    },
    {
      // should be valid to use transaction with outer passed transaction in function
      code: `
        async function create(dto: CreateDto, passedTransaction?: Transaction): Promise<string[]> {
            const transaction = await sequelize.transaction({ transaction: passedTransaction });
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        };
      `,
    },
    {
      // should be valid to pass a pass transaction to function without committing / rolling back in function
      code: `
        async function create(dto: CreateDto, transaction?: Transaction): Promise<string[]> {
          functionCall(transaction);
        };
      `,
    },
    {
      // should be valid to pass a transaction as an object attribute in a param
      code: `
        async function create(dto: CreateDto, transaction?: Transaction): Promise<string[]> {
          functionCall({transaction});
        };
      `,
    },
    {
      // should be valid to pass a transaction as an object attribute in a with different name
      code: `
        async function create(dto: CreateDto, passedTransaction?: Transaction): Promise<string[]> {
          functionCall({
            transaction: passedTransaction
           });
        };
      `,
    },
    {
      // should be valid to pass transaction as object attribute in first param of sequelize function
      code: `
      class SomeClass {
        async findByEmail(mail: string, transaction?: Transaction): Promise<User> {
          return User.findOne({
            where: {
              mail,
            },
            rejectOnEmpty: new NotFoundException('Could not find User with given email'),
            transaction,
          });
        } 
      }
      `,
    },
    {
      // should be valid with transaction || null
      code: `
      class SomeClass {
        async findByEmail(mail: string, transaction?: Transaction): Promise<User> {
          return User.findOne({
            where: {
              mail,
            },
            rejectOnEmpty: new NotFoundException('Could not find User with given email'),
            transaction: transaction || null,
          });
        } 
      }
      `,
    },
  ],
  invalid: [
    {
      // should be invalid to omit committing in method
      code: `class TestClass {
                public create(dto: CreateDto): Promise<string[]> {
                    const transaction = await this.sequelize.transaction();
                    
                    try {
                      const created = this.service.create(dto);
                      
                      return created;
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
      // should be invalid to omit rolling back in method
      code: `
        class TestClass {
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
        }
      `,
      errors: [
        {
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
    {
      // should be invalid to omit committing in function
      code: `
        async function create(dto: CreateDto): Promise<string[]> {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        }
      `,
      errors: [
        {
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
    {
      // should be invalid to omit rolling back in function
      code: `
        async function create(dto: CreateDto): Promise<string[]> {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                throw e;
            }
        }
      `,
      errors: [
        {
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
    {
      // should be invalid to omit committing in arrow function
      code: `
        const create = async (dto: CreateDto): Promise<string[]> => {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            return created;
            try {
            } catch (e) {
                await transaction.rollback();
                
                throw e;
            }
        }
      `,
      errors: [
        {
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
    {
      // should be invalid to omit rolling back in arrow function
      code: `
        const create = async (dto: CreateDto): Promise<string[]> => {
            const transaction = await sequelize.transaction();
            
            const created = this.service.create(dto);
            
            await transaction.commit();
            
            return created;
            try {
            } catch (e) {
                throw e;
            }
        }
      `,
      errors: [
        {
          messageId: 'sequelizeTransactionsMustBeCommitted',
        },
      ],
    },
  ],
});
