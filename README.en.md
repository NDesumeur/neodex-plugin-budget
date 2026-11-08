# Budget

Keep track of the money in your accounts and savings accounts: balances, expenses, income, transfers and subscriptions, then a 12-month forecast of your savings, interest and ceilings included.

*Version française : [README.md](README.md)*

## Your accounts

- To start with: a **main account**, a **Livret A** (ceiling €22,950) and a **Livret Jeune** (ceiling €1,600), the French regulated savings accounts.
- **+ New account**: a name, the type (**current account** or **savings**: livret, PEL…), a ceiling if you want, and an interest rate **per year** or **per month**. **Edit** changes all of this or deletes the account with its operations.
- **Click a balance**: type the amount shown by your bank directly (**Enter** or click elsewhere to keep it, **Escape** to cancel). It is the simplest way to stay accurate.
- An account with a ceiling shows a fill bar, and "full" when it is reached.

## Operations

- **Add an operation**: an **expense**, **income** or a **transfer** from one account to another, with an amount and an optional label (shopping, salary…). The balance changes straight away.
- **Latest operations**: the most recent ones. Deleting an operation puts the balance back as it was; for a transfer, both sides are cancelled.

## Subscriptions

Add your regular direct debits (Netflix, Spotify, phone…): a name, an amount, a frequency (**weekly**, **monthly** or **yearly**), the next payment date and the account it comes from. On the day, the "Subscription: …" expense is added to the account by itself, and the next date is worked out. If NeoDex was closed, each missed payment is added on its own date.

## Plan my savings

- Enter how much you put aside **each month** and on which savings account, with an optional **goal**.
- The plugin works month by month over 12 months: first each account's interest (a yearly rate is converted to the equivalent monthly rate, so 12 % a year really gives 12 % after a year), then your payment.
- When a savings account reaches its ceiling, the rest goes to the other one automatically; if they are all full, the plugin tells you.
- It shows what you will have in 3 months, 6 months and 1 year, the interest expected over a year, the month an account will be full and the date you will reach your goal (or "more than 10 years at this pace"). A bar chart shows the savings total for each of the next 12 months (the detail per account on hover), and marks the months where the goal is reached.

## Data and sync

Accounts, operations, subscriptions and the savings plan are stored by NeoDex, backed up and synced between your PCs when sync is on. Nothing is connected to your bank: you enter everything yourself. On first launch, the plugin picks up what you already had in NeoDex.

## Install

In NeoDex: **NeoStore → Discover → Budget → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
