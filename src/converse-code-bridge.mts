/**
 * Narrow, explicit PPA -> Code finite-generator handoff.
 *
 * PPA projections land in entity terms and its is-a specialization moves
 * entity terms. Code's four generators act on predication cells. The ONLY
 * direct shared cellwise generator supported here is converse. In particular
 * this is a candidate for Code's independent verifier, NOT a proof, NI,
 * source-observation attestation, or arbitrary language-cone functor.
 */
import {
  astOfRoute, renderProofPathAst, routeOf, termKey, witnessesOfCells,
  type AddressableTerm, type RelationalCell,
} from "./index.mts";

export type ConverseCodeBridgeRefusal =
  | "invalid-context"
  | "unwitnessed-source"
  | "unearned-ppa-route"
  | "non-liftable-generator"
  | "non-string-predication-cell"
  | "noncanonical-code-coordinate"
  | "code-profile-bound";

type CodeCell = Readonly<{ subject: string; predicate: string; object: string }>;
type CodeNode = Readonly<{ key: string; cell: CodeCell }>;
type CodeConverse = Readonly<{ from: string; generator: "converse"; to: string }>;

export type ConverseCodeBridgeResult =
  | Readonly<{ ok: false; reason: ConverseCodeBridgeRefusal }>
  | Readonly<{
      ok: true;
      sourceKey: string;
      targetKey: string;
      path: string;
      structure: Readonly<{
        version: 1;
        nodes: readonly CodeNode[];
        edges: readonly CodeConverse[];
        predicateMaps: readonly [];
      }>;
    }>;

const refuse = (reason: ConverseCodeBridgeRefusal): ConverseCodeBridgeResult =>
  Object.freeze({ ok: false, reason });
const lex = (left: string, right: string): number => left < right ? -1 : left > right ? 1 : 0;

function isCell(value: unknown): value is RelationalCell {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.keys(value).sort().join("|") === "object|predicate|subject";
}

function toCodeNode(value: AddressableTerm): CodeNode | null {
  if (!isCell(value)) return null;
  const { subject, predicate, object } = value;
  const coordinates = [subject, predicate, object];
  if (!coordinates.every(v => typeof v === "string" && v.length >= 1 && v.length <= 4096)) return null;
  if (coordinates.some(v => [...(v as string)].some(ch => {
    const cp = ch.codePointAt(0)!;
    return cp >= 0xd800 && cp <= 0xdfff;
  }))) return null;
  const key = termKey(value);
  if (key.length < 1 || key.length > 1024 || key !== key.normalize("NFC") ||
      coordinates.some(v => (v as string) !== (v as string).normalize("NFC"))) return null;
  return Object.freeze({
    key,
    cell: Object.freeze({ subject: subject as string, predicate: predicate as string, object: object as string }),
  });
}

/**
 * Derive a Code version-1 finite structure and canonical SEN-compatible path
 * only where PPA's ORIGINAL cell-derived witnesses furnish a converse-only
 * route. The context must come from an external source-admission owner; its
 * possession here does not authenticate a performance or observation.
 *
 * Consumers MUST independently call Code's identifyFiniteGenerativeStructure,
 * Data's identifyProofPathWitness and Code's qualifyGenerativeProofPath on
 * exact committed bytes. This function neither hashes nor opens custody.
 */
export function candidateConverseCodeProofFromPpa({
  context, source, target,
}: Readonly<{
  context: readonly RelationalCell[];
  source: AddressableTerm;
  target: AddressableTerm;
}>): ConverseCodeBridgeResult {
  try {
    if (!Array.isArray(context) || context.length < 1 || context.length > 256 ||
        !context.every(isCell)) return refuse("invalid-context");
    // Use precisely the PPA owner's heterogeneous four-generator evidence;
    // do not rename entity projections into Code's reflexive triple maps.
    const evidence = witnessesOfCells(context);
    const sourceKey = termKey(source);
    if (!context.some(cell => termKey({subject: cell.subject, predicate: cell.predicate, object: cell.object}) === sourceKey) &&
        !evidence.some(w => termKey(w.domain) === sourceKey)) return refuse("unwitnessed-source");
    const cellwise = evidence.filter(w => w.generator === "converse");
    const route = routeOf(cellwise, source, target);
    if (!route) {
      return refuse(routeOf(evidence, source, target) ? "non-liftable-generator" : "unearned-ppa-route");
    }

    const nodes = new Map<string, CodeNode>();
    const edges = new Map<string, CodeConverse>();
    let previous: AddressableTerm = route.root;
    for (const step of [{ node: route.root }, ...route.steps]) {
      const mapped = toCodeNode(step.node);
      if (!mapped) {
        // Strings, arbitrary JSON and source-non-NFC coordinates cannot be
        // smuggled into Code's typed predication-node and canonical-key space.
        return refuse(!isCell(step.node) ||
          [step.node.subject, step.node.predicate, step.node.object].some(v => typeof v !== "string")
          ? "non-string-predication-cell" : "noncanonical-code-coordinate");
      }
      nodes.set(mapped.key, mapped);
    }
    for (const step of route.steps) {
      const from = termKey(previous);
      const to = termKey(step.node);
      const edge = Object.freeze({ from, generator: "converse" as const, to });
      edges.set(JSON.stringify([from, edge.generator, to]), edge);
      previous = step.node;
    }
    const path = renderProofPathAst(astOfRoute(route));
    if (nodes.size > 256 || edges.size > 1024 || path.length > 32768) return refuse("code-profile-bound");
    const sortedNodes = Object.freeze([...nodes.values()].sort((a, b) => lex(a.key, b.key)));
    const sortedEdges = Object.freeze([...edges.values()].sort((a, b) =>
      lex(JSON.stringify([a.from, a.generator, a.to]), JSON.stringify([b.from, b.generator, b.to]))));
    return Object.freeze({
      ok: true,
      sourceKey,
      targetKey: termKey(target),
      path,
      structure: Object.freeze({
        version: 1 as const,
        nodes: sortedNodes,
        edges: sortedEdges,
        predicateMaps: Object.freeze([]) as readonly [],
      }),
    });
  } catch {
    return refuse("invalid-context");
  }
}
