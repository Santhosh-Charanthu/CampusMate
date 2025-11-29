const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          const parts = v.split("@");
          if (parts.length !== 2) return false;
          const domain = parts[1].toLowerCase();
          // adjust this based on how strict you want
          return domain.includes(".edu");
        },
        message: (props) =>
          `${props.value} is not a valid student email (domain must contain '.edu')`,
      },
    },

    password: {
      type: String,
      required: true,
      // optional but recommended
      select: false,
    },

    college: {
      name: { type: String, default: "" },
      rollNumber: { type: String, default: "" },
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Hide password if somehow selected and converted to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
