# Proof path structuration service

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

This pure capability folds a JSON-addressable semiotic atom, a foundational
root, and explicit generator evidence into a canonical relative POSIX filepath
AST. The atom is the target term. The evidence earns the descent.

Callers may supply direct `witnesses`, or relational `context` cells from which
the four recovered predicate-category generators are derived. Supplying neither
or both is refused. An unreachable atom returns `unearned-path`; the service
never guesses a placement and performs no filesystem or registry operation.

```js
const result = structureSemioticAtom({
  atom: "room",
  root: "category",
  context: [
    { subject: "room", predicate: "is-a", object: "paracosm" },
    { subject: "paracosm", predicate: "is-a", object: "category" },
  ],
});
```

The npm-package source diagnostic described during intake is a possible caller,
not part of this package. It would have to supply its own admitted observations
and morphism witnesses.

## RMN proof coordinates

`settleProofCoordinate` exposes the bounded RMN adapter. A coordinate is a
versioned, type-labelled settlement term with its root, target, and normalized
generator witnesses. It is semantic material, not by itself an identity. An
unearned or malformed coordinate refuses. The parent proof-pathing section's
identity adapter translates an earned coordinate into a closed RMN term and
commits its normalized semantic-content v2 envelope before canonical CBOR and
NI naming.

`proofPathOfCoordinate` derives the existing POSIX AST from a settled
coordinate, so a filesystem path is never the coordinate itself. Dynamic names
are represented separately by `ProofSelector`, which declares its resolver.
`ProofEnvelope` retains the coordinate while carrying optional commitment,
Merkle, signature, and 5615611 anchor witnesses; the witnesses are boundary
evidence, not replacement coordinates or identities.

## Provenance

This service normalizes the recoverable `@561-group/proof-pathing` repository at
commit `dcb26c3a77ed0d2f5113be2f1266e688d2425b1f`. It retains the canonical term
codec, four generator classes, witnessed route, and
`root/<generator>/library/<term>` grammar. It removes the retired
`@561-group/meme` and `@561-group/memetic-processing-unit` dependencies,
narrows the former `Term = unknown` boundary to finite JSON values, makes route
tie-breaking independent of evidence order, and promotes the filepath from a
string to an AST with a separately checkable codec.

## Explicit PPA -> Code converse leg (draft)

The subpath export `./converse-code-bridge` exposes
`candidateConverseCodeProofFromPpa({context,source,target})`. It reuses
**this package's existing** `witnessesOfCells`, `routeOf`, term-key
normalization and POSIX path codec. Given an externally source-admitted
relational context, it derives only a **converse-only** route between
cell-shaped terms, returning a Code finite-generative-structure *candidate*,
its typed source and target keys, and its canonical generator path. It performs
no hashing, storage, file I/O, attestation, typechecker bypass or side effects.

This is a deliberate **partial translation**, not a license to equate generator
names between independently defined categories:

| PPA witness | PPA domain → codomain | Code interpretation | Handoff |
| --- | --- | --- | --- |
| converse | predication cell → reversed predication cell | reversed predication cell | candidate allowed |
| subject-projection | predication cell → **bare entity** | reflexive subject **cell** | non-liftable |
| object-projection | predication cell → **bare entity** | reflexive object **cell** | non-liftable |
| `is-a` specialization | object entity → subject entity | predicate-coordinate map of a cell | non-liftable |

A source of either an entity or a cell is permitted for **refusal diagnosis**,
but a successful Code candidate contains only string-valued predication cells
with exact keys and finite Code bounds. It derives **no source-independent
subject/object positions** from the diagonal utterance seed; the original
Science conservation theorem remains authoritative. An empty identity path
does not establish an external source act.

The returned data is **not** a qualified proof: an independent consumer must
commit the candidate `structure` using Code's existing
`identifyFiniteGenerativeStructure` (with Data SEN's
`EMPTY_WITNESS_ROOT`), commit the named `sourceKey`, `targetKey` and
`path` using Data's existing `identifyProofPathWitness`, then replay **both
actual byte carriers** using Code's `qualifyGenerativeProofPath`. Only then
may the result be bound through Code's existing proof-composition and
immutable-content-custody path. Neither a valid candidate nor a content NI
proves observation, execution, authority, or Yoneda cone commutation.

The source/real-time consumer acceptance remains on
[proof-pathing engineering #2](https://github.com/red-cup-engineering/proof-pathing-engineering-services-section/issues/2);
the separate content-addressed proof closure is being reviewed in
[Code #174](https://github.com/red-cup-engineering/computer-code-engineering-services-section/pull/174).
This subpath deliberately contains **no second address format, hash
implementation, record registry, storage engine or theorem prover**.
