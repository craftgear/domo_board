オニオンアーキテクチャでビジネスロジックがSQL句に入るのを防ぐ方法

オニオンアーキテクチャでコードを構成する際に、頭を悩ませていたのがSQLにビジネスロジックが入ってしまうことでした。

データをフィルタしたい場合に、SQLで取得した後`Array.filter`でフィルタを掛けるのはメモリも食うしパフォーマンスも悪いので現実的ではありません。

そのため、いままではしかたなくSQLのWHERE句にフィルタ条件を書いていたのですが、WHERE句に書く条件を定数としてドメイン層に定義してみればどうか、と思いついたので以下にメモを残します。

## 例：過去1年分の購入額が100万円以上の人を得意客として抽出する

### 課題
SQLで `SELECT * FROM customers JOIN order ON customers.id = orders.customer_id WHERE (SELECT SUM(total) FROM orders WHERE created_at > "2024-01-24" GROUP BY cutomer_id) > 1000000` と書きたいが、そうすると「1年間の購入額が100万円以上」というビジネスロジックをインフラ層に置くことになってしまう。

### 対策
1. ビジネスロジックの値を定数としてドメイン層に書き、それを受け取ってSQLを発行するリポジトリの型も同時に定義する。

2. アプリケーション層でインフラ層のコードを呼び出す際にドメイン層の定数を引数に渡す。

コードに起こすと以下のようになります。

```ts domain.ts

type CustomerId = Branded('CustomerId', number);

type Customer = {
	id: CutomerId;
}
```
```ts domain.ts
const ValuedCustomerCriteria = {
	period: 'one_year',
	totalAmount: 100000,
} as const;
type ValuedCustomerCriteriaType = typeof ValuedCustomerCriteria;

type CustomerRepository = {
	selectValuedCustomer: (x: ValuedCustomerCriteriaType) => Promise<Customer[]>
}
```


```ts usecase.ts
import { CustomerRepository, ValuedCustomerCriteria } from './domain.ts';

const campaignForValuedCustomers = async (repo: CustomerRepository) => {
	return repo.selectValuedCustomer(ValuedCustomerCriteria);
}
```

```ts infra.ts
import { db } from './db';
import { CustomerRepository, ValuedCustomerCriteriaType } from './domain.ts';

export const repo: CustomerRepository  = {
	selectValuedCustomer: async (criteria: ValuedCustomerCriteriaType) => {
		const date = calcDate(criteria.period); // Function to get date based on period (one_year, two_years etc.)
		return db.sql("SELECT * FROM customers JOIN orders ON customers.id = orders.customer_id WHERE (SELECT SUM(total) FROM orders WHERE created_at > '?' GROUP BY customer_id) > ?", date, criteria.totalAmount).execute();
	}
}
```

While the SUM(total) portion remains in SQL, the `selectValuedCustomer` function requires `ValuedCustomerCriteria`, keeping the domain knowledge of what constitutes a valued customer in the domain layer.

I welcome any alternative solutions to this problem.

