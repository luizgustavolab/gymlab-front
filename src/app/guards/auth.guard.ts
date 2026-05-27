import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { supabase } from '../supabase';

export const authGuard: CanActivateFn = async () => {

  const router = inject(Router);

  const {
    data
  } = await supabase.auth.getSession();

  const session = data.session;

  if (!session) {

    router.navigate(['/']);

    return false;
  }

  return true;
};