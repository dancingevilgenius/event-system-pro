import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  clearRegistrationSelectedUser,
  isRegistrationDeskPath,
} from '../lib/registrationSelection';

/** Drops the selected registrant once navigation leaves the registration desk. */
export function useClearRegistrationSelectionOutsideDesk(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isRegistrationDeskPath(pathname)) {
      clearRegistrationSelectedUser();
    }
  }, [pathname]);
}
