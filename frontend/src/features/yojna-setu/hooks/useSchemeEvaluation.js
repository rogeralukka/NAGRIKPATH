import { useMemo } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import schemesSeed from '../../../data/seed/schemes.json';
import { checkEligibility } from '../../../engine/eligibility';
import { computeDelta } from '../../../engine/deltaResolver';

/**
 * useSchemeEvaluation:
 * Pure evaluation hook consuming HouseholdContext and evaluating all seed schemes
 * through the deterministic engine (checkEligibility + computeDelta).
 * Categorizes schemes into ELIGIBLE-READY, ELIGIBLE-BLOCKED, or INELIGIBLE.
 */
export function useSchemeEvaluation() {
  const { household, activeMemberId, activeMember, headOfHousehold } = useHousehold();

  const evaluatedSchemes = useMemo(() => {
    if (!activeMember || !headOfHousehold) {
      return [];
    }

    const schemesList = Object.values(schemesSeed);

    return schemesList.map((scheme) => {
      // 1. Evaluate Eligibility Criteria
      const eligibilityResult = checkEligibility(activeMember, headOfHousehold, scheme);

      if (!eligibilityResult.eligible) {
        // Find the primary failure reason from engine
        const failureReason =
          eligibilityResult.reasons?.find(
            (r) =>
              r.toLowerCase().includes('not met') ||
              r.toLowerCase().includes('exceeded') ||
              r.toLowerCase().includes('restricted')
          ) ||
          eligibilityResult.reasons?.[0] ||
          'Eligibility criteria not satisfied.';

        return {
          ...scheme,
          state: 'INELIGIBLE',
          eligibilityResult,
          ineligibleReason: failureReason,
          delta: null
        };
      }

      // 2. Criteria Passed -> Compute Document Delta
      const delta = computeDelta(activeMember, headOfHousehold, scheme);
      const isReady = delta.status === 'READY' || (delta.missingDocs.length === 0 && delta.expiredDocs.length === 0);

      return {
        ...scheme,
        state: isReady ? 'ELIGIBLE-READY' : 'ELIGIBLE-BLOCKED',
        eligibilityResult,
        delta
      };
    });
  }, [household, activeMemberId, activeMember, headOfHousehold]);

  // Compute dynamic counts with zero hardcoded numbers
  const eligibleReadyCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'ELIGIBLE-READY').length,
    [evaluatedSchemes]
  );

  const eligibleBlockedCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'ELIGIBLE-BLOCKED').length,
    [evaluatedSchemes]
  );

  const ineligibleCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'INELIGIBLE').length,
    [evaluatedSchemes]
  );

  const totalEligible = eligibleReadyCount + eligibleBlockedCount;

  return {
    evaluatedSchemes,
    eligibleReadyCount,
    eligibleBlockedCount,
    ineligibleCount,
    totalEligible,
    activeMember,
    headOfHousehold
  };
}

export default useSchemeEvaluation;
