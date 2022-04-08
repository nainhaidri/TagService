const Tag = require("./../models").Tag;
const Response = require("./../config/response");
const Op = require("sequelize").Op;

exports.createTag = (req, res) => {
  Tag.findOne({
    where: {
      user_id: req.user.id,
      tag: req.body.tag,
    },
  }).then((tag) => {
    if (tag) {
      let response = Response.getResponse(
        false,
        null,
        "This tag already exists"
      );
      return res.status(400).json(response);
    }
    Tag.create({
      tag: req.body.tag,
      user_id: req.user.id,
    })
      .then((tagCreated) => {
        let response = Response.getResponse(
          true,
          { tag_id: tagCreated.id },
          "Tag created"
        );
        return res.status(201).json(response);
      })
      .catch((err) => {
        let response = Response.getResponse(false, null, err.message);
        res.status(500).json(response);
      });
  });
};

exports.getTags = async (req, res) => {
  let tags = [];
  let whereClause = {};
  if (req.query.user_id) {
    whereClause.user_id = req.query.user_id;
  }
  if (req.query.text) {
    whereClause.tag = { [Op.like]: req.query.text + "%" };
  }

  try {
    tags = await Tag.findAll({
      where: whereClause,
      order: [
          ['tag', 'asc']
      ]
    });

    let response = Response.getResponse(true, tags, "Tags fetched");
    res.status(200).json(response);
  } catch (err) {
    let response = Response.getResponse(false, null, err.message);
    res.status(500).json(response);
  }
};

exports.getUserTags = (req, res) => {
  Tag.findAll({
    where: {
      user_id: req.params.user_id,
    },
    order: [
        ['tag', 'asc']
    ]
  })
    .then((tags) => {
      let response = Response.getResponse(true, tags, "Tags fetched");
      res.status(200).json(response);
    })
    .catch((err) => {
      let response = Response.getResponse(false, null, err.message);
      res.status(500).json(response);
    });
};

exports.deleteTag = (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.tag_id,
    },
  })
    .then(async (tag) => {
      if (!tag) {
        let response = Response.getResponse(
          false,
          null,
          "No tag with such Id found"
        );
        return res.status(404).json(response);
      } else if (tag.user_id !== req.user.id) {
        let response = Response.getResponse(
          false,
          null,
          "You are not allowed to delete other user's tag"
        );
        return res.status(401).json(response);
      }
      await tag.removeVideos([req.params.tag_id]);
      await Tag.destroy({
        where: {
          id: req.params.tag_id,
          user_id: req.user.id,
        },
      });
      let response = Response.getResponse(
        true,
        null,
        "Tag deleted successfully"
      );
      res.status(200).json(response);
    })
    .catch((err) => {
      let response = Response.getResponse(false, null, err.message);
      res.status(500).json(response);
    });
};

exports.updateTag = (req, res) => {
  if (!req.body.tag) {
    let response = Response.getResponse(false, null, "Tag value is required");
    return res.status(400).json(response);
  }
  Tag.findOne({
    where: {
      id: req.params.tag_id,
    },
  })
    .then(async (tag) => {
      if (!tag) {
        let response = Response.getResponse(
          false,
          null,
          "No tag with such Id found"
        );
        return res.status(404).json(response);
      } else if (tag.user_id !== req.user.id) {
        let response = Response.getResponse(
          false,
          null,
          "You are not allowed to update other user's tag"
        );
        return res.status(401).json(response);
      }
      await tag.update({
        tag: req.body.tag,
      });
      let response = Response.getResponse(
        true,
        null,
        "Tag updated successfully"
      );
      res.status(200).json(response);
    })
    .catch((err) => {
      let response = Response.getResponse(false, null, err.message);
      res.status(500).json(response);
    });
};
