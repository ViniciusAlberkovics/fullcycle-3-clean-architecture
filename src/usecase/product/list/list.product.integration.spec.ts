import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product("123", "Mouse", 321);
    await productRepository.create(product1);
    const product2 = new Product("654", "Keyboard", 654);
    await productRepository.create(product2);

    const input = {};

    const result = await usecase.execute(input);

    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual(product1.id);
    expect(result.products[0].name).toEqual(product1.name);
    expect(result.products[0].price).toEqual(product1.price);
    expect(result.products[1].id).toEqual(product2.id);
    expect(result.products[1].name).toEqual(product2.name);
    expect(result.products[1].price).toEqual(product2.price);
  });
});
