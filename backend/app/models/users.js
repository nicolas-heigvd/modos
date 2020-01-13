const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Profile = new Schema({
    age: {
        type: Number,
        required: [ true, 'age is required' ]
    },
    gender: {
        type: String,
        enum: [ 'm', 'f' ]
    },
    helper: {
        type: String,
        enum: [ 'white cane', 'walker', 'wheelchair' ],
        validate: {
            validator: function(v) {
                if (!this.helperFrequency) return false;
            },
            message: "Helper frequency is required if helper is defined"
        }
    },
    helperFrequency: {
        type: String,
        enum: [ 'rarely', 'sometimes', 'always' ],
        validate: {
            validator: function(v) {
                if (!this.helper) return false;
            },
            message: props => "Helper frequency shouldn't be defined if helper is undefined"
        }
    },
    mobility: {
        type: String,
        enum: [ 'perfect', 'good', 'reduced', 'minimal' ],
        required: [ true, 'mobility is required' ]
    }
});

const User = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    pseudonym: {
        type: String,
        required: [ true, 'pseudonym is required' ],
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [ true, 'email is required' ],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [ true, 'password is required' ]
    },
    events: [ObjectId],
    profile: Profile
}, {
    timestamps: true
});

User.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

User.methods.toResponseJSON = function() {
    return {
        pseudonym: this.pseudonym,
        email: this.email,
        profile: this.profile.toResponseJSON(),
        events: this.events,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

Profile.methods.toResponseJSON = function() {
    return {
        age: this.age,
        gender: this.gender,
        helper: this.helper,
        helperFrequency: this.helperFrequency,
        mobility: this.mobility
    };
};

module.exports = mongoose.model('User', User);
