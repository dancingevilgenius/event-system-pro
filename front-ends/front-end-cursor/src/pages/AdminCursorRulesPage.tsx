import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserCursorRulesStarred,
  setUserCursorRulesStarred,
} from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { centeredContentStackSx, CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  loadCursorRules,
  sortCursorRules,
  type CursorRule,
} from '../lib/cursorRules';

function parseStarredIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

function RuleMetaChips({ rule }: { rule: CursorRule }) {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 0.5, flexWrap: 'wrap' }}>
      {rule.alwaysApply ? <Chip size="small" label="Always applied" color="primary" /> : null}
      {rule.globs ? <Chip size="small" label={`Scope: ${rule.globs}`} variant="outlined" /> : null}
    </Stack>
  );
}

function RuleBody({ body }: { body: string }) {
  return (
    <Typography
      component="pre"
      variant="body2"
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        m: 0,
      }}
    >
      {body}
    </Typography>
  );
}

export default function AdminCursorRulesPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { showProblem } = useMessages();

  const allRules = useMemo(() => loadCursorRules(), []);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | false>(false);

  const sortedRules = useMemo(
    () => sortCursorRules(allRules, starredIds),
    [allRules, starredIds],
  );

  useEffect(() => {
    if (!session?.user_id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const ids = await fetchUserCursorRulesStarred(session.user_id);
        if (!cancelled) {
          setStarredIds(ids);
        }
      } catch (error) {
        if (!cancelled) {
          showProblem(
            error instanceof Error ? error.message : 'Unable to load starred Cursor rules.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user_id, showProblem]);

  const handleToggleStar = useCallback(
    async (ruleId: string) => {
      const isStarred = starredIds.includes(ruleId);
      const nextStarred = isStarred
        ? starredIds.filter((id) => id !== ruleId)
        : [...starredIds, ruleId];

      setStarredIds(nextStarred);
      setSavingRuleId(ruleId);

      try {
        const result = await setUserCursorRulesStarred(nextStarred);
        if (!result.ok) {
          setStarredIds(starredIds);
          showProblem(result.message ?? 'Unable to save starred Cursor rules.');
          return;
        }

        setStarredIds(parseStarredIds(result.cursor_rules_starred));
      } catch (error) {
        setStarredIds(starredIds);
        showProblem(
          error instanceof Error ? error.message : 'Unable to save starred Cursor rules.',
        );
      } finally {
        setSavingRuleId(null);
      }
    },
    [showProblem, starredIds],
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Cursor Rules
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Project rules from <code>.cursor/rules</code>. Star important rules to pin them to the top.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : sortedRules.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No Cursor rules were found. Run <code>npm run prebuild</code> in the front-end package to
            sync rules from <code>.cursor/rules</code>.
          </Typography>
        ) : (
          <Stack spacing={1.5} sx={{ ...centeredContentStackSx, maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
            {sortedRules.map((rule) => {
              const isStarred = starredIds.includes(rule.id);
              const isSaving = savingRuleId === rule.id;

              return (
                <Accordion
                  key={rule.id}
                  disableGutters
                  elevation={0}
                  variant="outlined"
                  expanded={expandedRuleId === rule.id}
                  onChange={(_event, isExpanded) => {
                    setExpandedRuleId(isExpanded ? rule.id : false);
                  }}
                  sx={{ width: '100%' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'flex-start', width: '100%', pr: 1 }}
                    >
                      <IconButton
                        size="small"
                        aria-label={isStarred ? 'Unstar rule' : 'Star rule'}
                        disabled={isSaving}
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleToggleStar(rule.id);
                        }}
                        sx={{ mt: -0.25 }}
                      >
                        {isStarred ? (
                          <StarIcon fontSize="small" color="warning" />
                        ) : (
                          <StarBorderIcon fontSize="small" />
                        )}
                      </IconButton>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {rule.title}
                        </Typography>
                        {rule.description ? (
                          <Typography variant="body2" color="text.secondary">
                            {rule.description}
                          </Typography>
                        ) : null}
                        <RuleMetaChips rule={rule} />
                      </Box>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <RuleBody body={rule.body} />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}

        <Stack spacing={2} sx={{ mt: 4, ...centeredContentStackSx }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
