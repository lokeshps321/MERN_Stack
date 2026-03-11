export async function getMe(req, res) {
  const user = req.user;
  res.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      city: user.city,
      verifiedEmail: user.verifiedEmail,
      verifiedPhone: user.verifiedPhone
    }
  });
}

export async function updateProfile(req, res) {
  const { name } = req.body;
  if (!name || name.trim().length < 1) {
    return res.status(400).json({ error: "Name is required" });
  }

  req.user.name = name.trim();
  await req.user.save();

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
      city: req.user.city,
      verifiedEmail: req.user.verifiedEmail,
      verifiedPhone: req.user.verifiedPhone
    }
  });
}

export async function updateRole(req, res) {
  const { role } = req.body;
  if (!role || !["buyer", "seller"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  req.user.role = role;
  await req.user.save();

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
      city: req.user.city,
      verifiedEmail: req.user.verifiedEmail,
      verifiedPhone: req.user.verifiedPhone
    }
  });
}
