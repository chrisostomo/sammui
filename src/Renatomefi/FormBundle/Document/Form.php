<?php

namespace Renatomefi\FormBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * @ODM\Document
 */
class Form
{

    /**
     * @ODM\Id(strategy="auto")
     */
    protected $id;

    /**
     * @ODM\String
     */
    protected $name;

    /**
     * @ODM\Date
     */
    protected $createdAt;

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set createdAt
     *
     * @param \MongoDate $createdAt
     * @return self
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \MongoDate $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
}
