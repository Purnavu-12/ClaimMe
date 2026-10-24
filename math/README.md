# Illustrative settlement derivation

All engine inputs and outputs use integer paise. `src/domain/engine.ts` implements and validates this synthetic calculation:

Hospital bill ₹1,00,000 minus non-payable items ₹5,000 minus sub-limit adjustment ₹10,000 gives the admissible base ₹85,000. A synthetic policy co-pay of 10% on that base is ₹8,500. The recorded settlement is ₹76,500.

Round the co-pay once to the nearest paise. Reject negative, non-finite, fractional-paise, excessive adjustment and out-of-range percentage inputs. The source letter, contract, adjustment order and calculation base must be established for a real claim. This example is not a universal rule or a bank-payment confirmation.

Boundary and regression tests are in `tests/domain.test.ts`.
