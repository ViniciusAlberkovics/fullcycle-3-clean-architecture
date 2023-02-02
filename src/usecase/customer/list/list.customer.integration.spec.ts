import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";

describe("Test list customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new ListCustomerUseCase(customerRepository);

    const customer1 = new Customer("123", "John");
    const address1 = new Address("Street", 123, "Zip", "City");
    customer1.changeAddress(address1);
    const customer2 = new Customer("456", "Jane");
    const address2 = new Address("Street 2", 1233, "Zip 2", "City 2");
    customer2.changeAddress(address2);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const input = {};

    const result = await usecase.execute(input);

    expect(result.customers.length).toEqual(2);
    expect(result.customers[0].id).toBe(customer1.id);
    expect(result.customers[0].name).toBe(customer1.name);
    expect(result.customers[0].address.street).toBe(customer1.Address.street);
    expect(result.customers[1].id).toBe(customer2.id);
    expect(result.customers[1].name).toBe(customer2.name);
    expect(result.customers[1].address.street).toBe(customer2.Address.street);
  });
});
