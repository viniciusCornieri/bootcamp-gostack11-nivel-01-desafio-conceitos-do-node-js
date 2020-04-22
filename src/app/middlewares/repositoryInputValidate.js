const Yup = require("yup");

module.exports = async (request, response, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().min(1),
    url: Yup.string().url(),
    techs: Yup.array().of(Yup.string())
  });

  try {
    await schema.validate(request.body, { abortEarly: false });
  } catch (err) {
    return response
      .status(400)
      .json({ error: "Validation failed", message: err.errors });
  }

  return next();
}