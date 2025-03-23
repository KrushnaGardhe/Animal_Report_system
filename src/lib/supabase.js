import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpNGO = async (formData) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          organization: formData.organization,
          registration_number: formData.registrationNumber,
          role: 'ngo'
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No user data returned from signup');
    }

    // Wait a moment to ensure the user is created in the auth system
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create the profile with retry logic
    let retries = 3;
    let profileCreated = false;
    let lastError = null;

    while (retries > 0 && !profileCreated) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: authData.user.id,
              name: formData.name,
              organization: formData.organization,
              phone: formData.phone,
              registration_number: formData.registrationNumber,
              address: formData.address,
              description: formData.description
            }
          ], {
            onConflict: 'id'
          });

        if (!profileError) {
          profileCreated = true;
          break;
        }

        lastError = profileError;
        console.error('Profile creation attempt failed:', profileError);
      } catch (error) {
        lastError = error;
        console.error('Profile creation attempt error:', error);
      }

      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!profileCreated) {
      // If profile creation failed, clean up the auth user
      await supabase.auth.signOut();
      throw new Error(lastError?.message || 'Failed to create NGO profile. Please try again.');
    }

    return { user: authData.user, profile: null };
  } catch (error) {
    console.error('SignUp error:', error);
    throw error;
  }
};

export const signInNGO = async (email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No user data returned from signin');
    }

    // Fetch the NGO profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return { user: authData.user, profile };
  } catch (error) {
    console.error('SignIn error:', error);
    throw error;
  }
};

export const signOutNGO = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('SignOut error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (!session) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return { user: session.user, profile };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Report management functions
export const saveReport = async (reportData) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving report:', error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const updateReportStatus = async (reportId, status, ngoId) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ 
        status,
        ngo_id: ngoId,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};