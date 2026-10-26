import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import {
  createEmptyEventDiscount,
  getEventDiscountDisplayName,
  type EventDiscountFormState,
} from '../lib/eventDiscounts';
import EventDiscountSortableAccordion from './EventDiscountSortableAccordion';

type AddEventDiscountsProps = {
  onFieldEdit?: () => void;
};

export default function AddEventDiscounts({ onFieldEdit }: AddEventDiscountsProps) {
  const [discounts, setDiscounts] = useState<EventDiscountFormState[]>([]);
  const [expandedDiscountId, setExpandedDiscountId] = useState<string | false>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteNameRef = useRef('');
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const discountIds = discounts.map((discount) => discount.id);

  useEffect(() => {
    reportExport('discounts', { discounts });
  }, [discounts, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    setDiscounts(appliedImport.discounts);
    setExpandedDiscountId(false);
    setPendingDeleteId(null);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const updateDiscount = (
    id: string,
    patch: Partial<Pick<EventDiscountFormState, 'name' | 'valueKind' | 'value' | 'description'>>,
  ) => {
    setDiscounts((current) =>
      current.map((discount) => (discount.id === id ? { ...discount, ...patch } : discount)),
    );
    onFieldEdit?.();
  };

  const handleAddDiscount = () => {
    const nextDiscount = createEmptyEventDiscount();
    setDiscounts((current) => [...current, nextDiscount]);
    setExpandedDiscountId(nextDiscount.id);
    onFieldEdit?.();
  };

  const handleAccordionChange =
    (discountId: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedDiscountId(isExpanded ? discountId : false);
    };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setDiscounts((current) => {
      const oldIndex = current.findIndex((discount) => discount.id === active.id);
      const newIndex = current.findIndex((discount) => discount.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
    onFieldEdit?.();
  };

  const requestDelete = (id: string) => {
    const discount = discounts.find((item) => item.id === id);
    pendingDeleteNameRef.current = getEventDiscountDisplayName(discount?.name ?? '');
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteId === null) {
      return;
    }

    setDiscounts((current) => current.filter((discount) => discount.id !== pendingDeleteId));
    setExpandedDiscountId((current) => (current === pendingDeleteId ? false : current));
    setPendingDeleteId(null);
    onFieldEdit?.();
  };

  return (
    <Box sx={mobileColumnSx}>
      <Stack spacing={1.5}>
        {discounts.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={discountIds} strategy={verticalListSortingStrategy}>
              <Stack spacing={1.5}>
                {discounts.map((discount) => (
                  <EventDiscountSortableAccordion
                    key={discount.id}
                    discount={discount}
                    expanded={expandedDiscountId === discount.id}
                    onAccordionChange={handleAccordionChange(discount.id)}
                    onChange={updateDiscount}
                    onDelete={requestDelete}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : null}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddDiscount}>
            Add New Discount
          </Button>
        </Box>
      </Stack>

      <Dialog
        open={pendingDeleteId !== null}
        onClose={cancelDelete}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-discount-title"
      >
        <DialogTitle sx={{ position: 'relative', minHeight: 40, p: 1 }}>
          <IconButton
            aria-label="Close"
            onClick={cancelDelete}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-discount-title">
            {`Delete ${pendingDeleteNameRef.current}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 4, pt: 1, pb: 3 }}>
          <Button onClick={cancelDelete} sx={{ minWidth: 96 }}>
            No
          </Button>
          <Button variant="contained" onClick={confirmDelete} sx={{ minWidth: 96 }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
