const supabase = require("../config/supabase");

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const user = data.user;

  // override default username created by trigger
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  res.json({
    message: "Signup successful",
    user: {
      id: user.id,
      email: user.email,
      username,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    message: "Login successful",
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    token: data.session.access_token,
  });
};