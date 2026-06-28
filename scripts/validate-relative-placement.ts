/**
 * Compare computeRelativePlacementOrder against published benchmark datasets.
 * Run: npx tsx scripts/validate-relative-placement.ts
 */

import {
  relativePlacementBenchmarks,
  type RelativePlacementBenchmark,
} from '../front-ends/front-end-cursor/src/data/reference/relativePlacementBenchmarks.ts';
import {
  buildRelativePlacementRows,
  computeRelativePlacementOrder,
} from '../front-ends/front-end-cursor/src/utils/relativePlacement.ts';

function bibMap(dataset: RelativePlacementBenchmark): {
  bibs: number[];
  placementByBib: Map<number, number[]>;
  labels: Map<number, string>;
} {
  const placementByBib = new Map<number, number[]>();
  const labels = new Map<number, string>();

  dataset.entries.forEach((entry, index) => {
    const bib = index + 1;
    placementByBib.set(bib, entry.judgePlacements);
    labels.set(bib, entry.label);
  });

  return {
    bibs: dataset.entries.map((_, index) => index + 1),
    placementByBib,
    labels,
  };
}

function compareDataset(dataset: RelativePlacementBenchmark) {
  const validation = dataset.validations.at(-1);

  if (dataset.requiresViolationHandling) {
    return {
      dataset,
      validation,
      ourOrder: [] as string[],
      mismatches: [] as string[],
      ties: [] as string[],
      skipped: true,
    };
  }

  const { bibs, placementByBib, labels } = bibMap(dataset);
  const ourOrder = computeRelativePlacementOrder(bibs, placementByBib);
  const ourRows = buildRelativePlacementRows(bibs, placementByBib);
  const ourByLabel = new Map(
    ourRows.map((row) => [labels.get(row.bib) ?? String(row.bib), row.place]),
  );

  const mismatches: string[] = [];
  const ties: string[] = [];

  const officialByPlace = new Map<number, string[]>();
  for (const result of dataset.officialResults) {
    const list = officialByPlace.get(result.place) ?? [];
    list.push(result.label);
    officialByPlace.set(result.place, list);
  }

  for (const result of dataset.officialResults) {
    const ourPlace = ourByLabel.get(result.label);
    const tiedOfficial = (officialByPlace.get(result.place) ?? []).length > 1;

    if (ourPlace === undefined) {
      mismatches.push(`${result.label}: missing from our results`);
      continue;
    }

    if (tiedOfficial) {
      const tiedLabels = officialByPlace.get(result.place) ?? [];
      const ourPlaces = tiedLabels.map((label) => ourByLabel.get(label));
      const ourUnique = new Set(ourPlaces);
      if (ourUnique.size === 1 && ourPlaces[0] === result.place) {
        ties.push(`${result.label}: official tie for ${result.place} — we also tied at ${ourPlace}`);
      } else if (!tiedLabels.every((label) => ourByLabel.get(label) === result.place)) {
        ties.push(
          `${result.label}: official tie for ${result.place} — we split as ${tiedLabels
            .map((label) => `${label}=${ourByLabel.get(label)}`)
            .join(', ')}`,
        );
      }
      continue;
    }

    if (ourPlace !== result.place) {
      mismatches.push(`${result.label}: official ${result.place}, ours ${ourPlace}`);
    }
  }

  return {
    dataset,
    validation,
    ourOrder: ourOrder.map((bib) => labels.get(bib) ?? String(bib)),
    mismatches,
    ties,
    skipped: false,
  };
}

for (const dataset of relativePlacementBenchmarks.datasets) {
  const result = compareDataset(dataset);
  const validation = result.validation;

  console.log('='.repeat(72));
  console.log(`Sport:        ${dataset.sport}`);
  console.log(`Judges:       ${dataset.judges}`);
  console.log(`Competitors:  ${dataset.competitors}`);
  console.log(`Match:        ${dataset.match}`);
  console.log(`Event:        ${dataset.event}`);
  console.log(`Source:       ${dataset.sourceUrl}`);
  if (validation) {
    console.log(`Validated:    ${validation.validatedOn}`);
    console.log(`Notes:        ${validation.notes}`);
  }
  console.log('');
  if (dataset.requiresViolationHandling) {
    console.log('Judge marks (raw, with violation annotations):');
    for (const entry of dataset.entries) {
      const marks =
        entry.judgeMarks?.map((mark) => mark.raw).join('  ') ??
        entry.judgePlacements.join('  ');
      const sorted = entry.marksSorted ? `  [sorted: ${entry.marksSorted}]` : '';
      console.log(`  ${entry.label.padEnd(42)} ${marks}${sorted}`);
    }
  } else {
    console.log('Judge placements (1 = best):');
    for (const entry of dataset.entries) {
      console.log(`  ${entry.label.padEnd(8)} ${entry.judgePlacements.join('  ')}`);
    }
  }
  console.log('');
  console.log(`Official order: ${validation?.officialOrder.join(' → ') ?? '—'}`);

  if (result.skipped) {
    console.log('Our order:      (skipped — requires violation handling)');
    console.log('');
    console.log('Live check: SKIPPED (pending violation rules)');
  } else {
    console.log(`Our order:      ${result.ourOrder.join(' → ')}`);
    console.log('');

    if (result.mismatches.length === 0 && result.ties.length === 0) {
      console.log('Live check: EXACT MATCH');
    } else {
      if (result.mismatches.length > 0) {
        console.log('Live mismatches:');
        for (const line of result.mismatches) {
          console.log(`  - ${line}`);
        }
      }
      if (result.ties.length > 0) {
        console.log('Live tie notes:');
        for (const line of result.ties) {
          console.log(`  - ${line}`);
        }
      }
    }
  }
  console.log('');
}

const todos = relativePlacementBenchmarks.implementationTodos ?? [];
if (todos.length > 0) {
  console.log('='.repeat(72));
  console.log('Implementation todos');
  for (const todo of todos) {
    console.log('');
    console.log(`[${todo.status}] ${todo.title} (${todo.id})`);
    if (todo.relatedDatasetIds?.length) {
      console.log(`  Datasets: ${todo.relatedDatasetIds.join(', ')}`);
    }
    for (const item of todo.items) {
      console.log(`  - ${item}`);
    }
  }
  console.log('');
}
