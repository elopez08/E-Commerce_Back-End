# E-Commerce Back End — Project Review & Reconstruction Guide

**Repository:** https://github.com/elopez08/E-Commerce_Back-End  
**Original work period:** June 5, 2022, Pacific time (commits dated June 6 UTC)  
**Reviewed:** October 27, 2026  
**Verification level:** Static inspection of repository source, README, commit history, models, routes, and seeds. The application has **not** been installed, executed, or tested against a live database during this review.

> **Important:** The actual application is in the `Develop/` subdirectory, not the repository root. Run application commands from `Develop/`.

## 1. Purpose

This is an Express.js REST API for an e-commerce database. The [original README](../README.md) states that a manager should be able to work with categories, products, and tags through API endpoints and a MySQL database. It describes testing with Insomnia and includes historical notes tracing the request flow through `server.js`, route modules, and models.

The README begins with a Bootcamp-style assignment specification, and `Develop/package.json` identifies `module-13-challenge-orm`. The code should therefore be described as **Bootcamp project work**, not assumed to be independently written from scratch. Compare with the original starter repository before making stronger authorship claims.

## 2. Stack and verified concepts

| Item | Verified location | What it demonstrates |
|---|---|---|
| Node.js / JavaScript | `Develop/server.js`, route files | Backend application structure and asynchronous callbacks/promises |
| Express.js | `Develop/server.js`, `Develop/routes/` | REST routes, HTTP request/response, middleware |
| MySQL | `Develop/db/schema.sql` | Relational database |
| Sequelize 5 | `Develop/models/`, `Develop/config/connection.js` | Object-Relational Mapping (ORM), CRUD, associations |
| mysql2 | `Develop/package.json` | Database driver used by Sequelize |
| dotenv | `Develop/config/connection.js` | Environment-driven database configuration |
| nodemon | `Develop/package.json` | Development restart script |
| Seed scripts | `Develop/seeds/` | Sample data loading and model synchronization |
| One-to-many relation | `Develop/models/index.js` | Category has many products |
| Many-to-many relation | `Develop/models/index.js` | Products and tags linked through ProductTag |
| GET / POST / PUT / DELETE | `Develop/routes/api/` | API CRUD operations |

**Distinction from Employee Tracker:** This project uses Sequelize methods such as `findAll`, `findOne`, `create`, `update`, and `destroy` rather than mostly handwritten `SELECT`, `INSERT`, and `UPDATE` SQL strings. Its schema file only drops and creates the database; Sequelize defines the tables through model definitions.

## 3. Source code map

- [`Develop/server.js`](../Develop/server.js): Express initialization, JSON middleware, routes, Sequelize synchronization, port 3001 default.
- [`Develop/config/connection.js`](../Develop/config/connection.js): Sequelize connection; reads `DB_NAME`, `DB_USER`, `DB_PW` from environment, or `JAWSDB_URL` if present.
- [`Develop/db/schema.sql`](../Develop/db/schema.sql): `DROP DATABASE IF EXISTS ecommerce_db` followed by `CREATE DATABASE ecommerce_db`.
- [`Develop/models/Category.js`](../Develop/models/Category.js): Category ID and category name.
- [`Develop/models/Product.js`](../Develop/models/Product.js): Product ID, name, `DECIMAL(10,2)` price, stock, category reference.
- [`Develop/models/Tag.js`](../Develop/models/Tag.js): Tag ID and name.
- [`Develop/models/ProductTag.js`](../Develop/models/ProductTag.js): Product–tag junction model with two foreign keys.
- [`Develop/models/index.js`](../Develop/models/index.js): All model associations.
- [`Develop/routes/index.js`](../Develop/routes/index.js): Mounts `/api` and a catch-all “Wrong Route!” response.
- [`Develop/routes/api/index.js`](../Develop/routes/api/index.js): Mounts `/categories`, `/products`, `/tags`.
- [`Develop/routes/api/category-routes.js`](../Develop/routes/api/category-routes.js): Category CRUD and related products.
- [`Develop/routes/api/product-routes.js`](../Develop/routes/api/product-routes.js): Product CRUD, category/tag includes, product–tag updates.
- [`Develop/routes/api/tag-routes.js`](../Develop/routes/api/tag-routes.js): Tag CRUD and related products.
- [`Develop/seeds/index.js`](../Develop/seeds/index.js): Reset/synchronize tables and seed in dependency order.
- [`Develop/package.json`](../Develop/package.json): Dependencies and npm scripts.

## 4. Database model

```text
Category (id, category_name)
   1 ────────── many Product (id, product_name, price, stock, category_id)
                        many
                          │
                    ProductTag (id, product_id, tag_id)
                          │
                        many
                     Tag (id, tag_name)
```

**Associations defined in `Develop/models/index.js`:**

- `Product.belongsTo(Category, { foreignKey: 'category_id' })`
- `Category.hasMany(Product, { foreignKey: 'category_id' })`
- `Product.belongsToMany(Tag, { through: ProductTag, foreignKey: 'product_id' })`
- `Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tag_id' })`

The many-to-many relationship is implemented through `ProductTag`, a junction table. `Product.js` declares a category foreign-key reference; `ProductTag.js` declares product and tag references.

## 5. API routes and CRUD methods

| Endpoint | GET collection | GET by ID | POST | PUT by ID | DELETE by ID |
|---|---|---|---|---|---|
| `/api/categories` | Yes | Yes | Yes | Yes | Yes |
| `/api/products` | Yes | Yes | Yes | Yes | Yes |
| `/api/tags` | Yes | Yes | Yes | Yes | Yes |

All routes are **present in source code**; this is not proof that every route works correctly at runtime.

Examples:

- `Category.findAll({ include: [{ model: Product }] })`: fetch categories and related products.
- `Product.findAll({ include: [{ model: Category }, { model: Tag }] })`: fetch products with category and tag data.
- `Tag.findOne({ where: { id: req.params.id }, include: [...] })`: fetch a tag by ID.
- `Product.create(req.body)`: insert a product via ORM.
- `ProductTag.bulkCreate(...)`: create product–tag associations.
- `Product.update(...)` and `ProductTag.destroy(...)`: update a product and its tag links.
- `Product.destroy({ where: { id: req.params.id } })`: delete a product.

## 6. Seed data

The `Develop/seeds/` directory contains:

| File | Seed count | Examples |
|---|---:|---|
| `category-seeds.js` | 5 | Shirts, Shorts, Music, Hats, Shoes |
| `product-seeds.js` | 5 | Plain T-Shirt, Running Sneakers, Cargo Shorts |
| `tag-seeds.js` | 8 | rock music, pop music, blue, red, white |
| `product-tag-seeds.js` | 12 | Product ID ↔ Tag ID pairs |

`Develop/seeds/index.js` loads categories, products, tags, then product–tag associations.

**Destructive operation:** `sequelize.sync({ force: true })` in the seed script drops/recreates the modeled tables. Do not run `npm run seed` on a database containing valuable records. The SQL schema script also starts with `DROP DATABASE IF EXISTS ecommerce_db`.

## 7. Rebuild and run — step by step

The following is a **reconstruction plan**, not an execution report.

### Prerequisites

- Node.js and npm
- Local MySQL server and MySQL command-line client (or equivalent)
- Terminal/editor
- API testing client such as Insomnia or Postman
- A disposable local MySQL database; do not use production data

### A. Clone and install

```bash
git clone https://github.com/elopez08/E-Commerce_Back-End.git
cd E-Commerce_Back-End/Develop
npm install
```

Historical versions include Express 4, Sequelize 5, mysql2 2, dotenv 8, and nodemon 2. These are older dependencies and may need updates for a modern runtime. First inspect the lockfile and compatibility; do not assume the unmodified project runs on the newest Node.js version.

### B. Create an isolated local database

**WARNING:** The schema command destroys any existing `ecommerce_db` database.

From `Develop/`, after verifying the target is disposable:

```bash
mysql -u YOUR_LOCAL_MYSQL_USER -p < db/schema.sql
```

The file creates the database, but Sequelize models are responsible for creating the tables when synchronized.

### C. Configure credentials

`Develop/config/connection.js` reads `DB_NAME`, `DB_USER`, and `DB_PW`. Create a **local, uncommitted** `Develop/.env` file:

```dotenv
DB_NAME=ecommerce_db
DB_USER=YOUR_LOCAL_MYSQL_USER
DB_PW=YOUR_LOCAL_MYSQL_PASSWORD
```

Replace placeholders locally. `Develop/.gitignore` already excludes `.env`. Avoid exposing real credentials in screenshots or commits. If `JAWSDB_URL` is set, the source prioritizes it over local settings.

### D. Seed only disposable data

```bash
npm run seed
```

This invokes `node seeds/index.js`, calls `sequelize.sync({ force: true })`, and inserts sample records.

### E. Start the API

```bash
npm start
```

The default local address is `http://localhost:3001` unless `PORT` is set. The root route intentionally displays “Wrong Route!”; use the `/api/...` paths below.

### F. Test GET endpoints

```bash
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/products
curl http://localhost:3001/api/tags
curl http://localhost:3001/api/products/1
```

Check that returned JSON includes related category/tag data where expected. Compare database records with seed data. A successful GET is not proof that POST/PUT/DELETE are correct.

### G. Test mutations safely

Use Insomnia/Postman against disposable data. Example product JSON:

```json
{
  "product_name": "Test Item",
  "price": 19.99,
  "stock": 5,
  "category_id": 1,
  "tagIds": [1, 2]
}
```

Test POST, PUT, and DELETE for each resource; verify actual database state after every mutation. The original product route assumes `tagIds` exists, so test with an array first and separately test the missing/empty-array edge cases after fixing the route.

## 8. Source-level issues and recommended repairs

The following findings are based on reading the code. Reproduce with tests before assigning exact runtime symptoms.

1. **Category detail typo:** In `Develop/routes/api/category-routes.js`, the GET-by-ID `attributes` array contains `categor_name`, but the model defines `category_name`. Correct the field name.
2. **Tag PUT response logic:** In `Develop/routes/api/tag-routes.js`, the handler checks `if(TagData)` and responds with 404, apparently reversing the success/not-found behavior. Sequelize `update` commonly returns an affected-row count array, so explicitly inspect it.
3. **Product POST double response:** In `Develop/routes/api/product-routes.js`, the no-tag branch sends `res.status(200).json(product)`, then the next `.then()` also attempts a response. Restructure to send once.
4. **Missing `tagIds` handling:** Product POST uses `req.body.tagIds.length`; PUT uses `req.body.tagIds.filter(...)`. Both assume an array. Validate and default appropriately.
5. **Category PUT not-found handling:** Its `if(!CategoryData)` test may not correctly distinguish a zero-row update because Sequelize's return value is typically an array. Inspect affected row count.
6. **Error messages:** Some product/tag routes refer to the wrong entity (“category”), and some messages contain typos; clarify for troubleshooting.
7. **Seed reset:** `force: true` is destructive. Keep it confined to a test environment; consider migrations for persistent data.
8. **Data validation:** Check stock nonnegativity, price bounds, integer IDs, missing values, and foreign-key errors. The model currently uses basic `isNumeric`/`isDecimal` validators.
9. **Security:** Use a dedicated limited-privilege local database user and never commit credentials. Review request validation before deploying an API.
10. **Legacy dependencies:** Plan a separate modernization pass, with tests, before upgrading Sequelize and other packages. Do not combine a wholesale upgrade with initial reconstruction.

## 9. Recommended learning path

1. Trace `server.js` → `routes/index.js` → `routes/api/index.js` → resource route.
2. Explain `require('../../models')` and relative paths.
3. Identify `Model.init` fields and validation rules.
4. Draw the one-to-many and many-to-many associations.
5. Observe what `sequelize.sync()` does in an empty database.
6. Seed records and inspect tables in MySQL.
7. Trace GET request → ORM query → JSON response.
8. Trace POST/PUT/DELETE request → database change.
9. Reproduce the bugs above and repair them one by one.
10. Add automated API tests and record verified results.

### Suggested modernized enhancements (not historical features)

- Consistent 400/404/500 error handling
- Input validation and clean JSON error messages
- Robust optional `tagIds` handling
- Tests for create/update/delete and associations
- Database migrations instead of destructive synchronization
- Explicit runtime compatibility and dependency updates
- API usage examples and screenshots in documentation

## 10. Contribution and portfolio accuracy

Evidence available:

- GitHub commit history contains an initial commit, an application-file addition, and a subsequent modification of six files on June 5, 2022 PDT.
- The README and source comments include detailed explanations of routing, relative paths, models, and troubleshooting.
- `Develop/package.json` and README indicate an educational starter-code context.

**Do not infer** that all source was independently authored or that every API route was successfully tested. Compare with the Bootcamp starter project, then document specific modifications. The latest commit modified `Develop/config/connection.js`, `Develop/models/ProductTag.js`, `Develop/models/Tag.js`, `Develop/models/index.js`, `Develop/routes/api/product-routes.js`, and `Develop/server.js`; commit history alone does not establish why each change was made.

Conservative resume/project summary:

> **E-Commerce Back End — Node.js, Express, MySQL, Sequelize (2022).** Worked on a Bootcamp REST API project for managing products, categories, and tags. Examined and modified Sequelize models, relational associations, API routes, and database configuration; documented application routing and backend troubleshooting.

Tailor the wording after reconstructing the project and verifying personal contributions.

## 11. Reconstruction checklist

- [ ] Review original source and compare with Bootcamp starter
- [ ] Install compatible Node.js and npm
- [ ] Clone repository and work inside `Develop/`
- [ ] Confirm disposable local MySQL target
- [ ] Run `db/schema.sql` only after reviewing destructive reset
- [ ] Configure local `.env` credentials
- [ ] Install dependencies
- [ ] Run seed script against disposable database
- [ ] Confirm expected record counts (5 categories, 5 products, 8 tags, 12 product-tag rows)
- [ ] Start server and test GET routes
- [ ] Test POST, PUT, DELETE with temporary records
- [ ] Reproduce and repair category GET-by-ID typo
- [ ] Reproduce and repair tag PUT response logic
- [ ] Repair product POST double-response path
- [ ] Validate missing/empty `tagIds`
- [ ] Test not-found and invalid-input handling
- [ ] Add automated tests
- [ ] Document verified run commands, outputs, and fixes
- [ ] Consider dependency modernization separately

**Status:** Source review completed; reconstruction and runtime verification pending.
