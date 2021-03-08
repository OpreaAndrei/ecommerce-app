package com.luv2code.ecommerce.config;

import com.luv2code.ecommerce.entity.Country;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsuportedActions = {HttpMethod.PUT, HttpMethod.POST,HttpMethod.DELETE};


        //disable HTTP methods for Product : PUT,POST AND DELETE

        disableHttpMethods(Product.class, config, theUnsuportedActions);

        //disalbe http method for product category : put, post and delete

        disableHttpMethods(ProductCategory.class, config, theUnsuportedActions);

        //disalbe http method for state : put, post and delete

        disableHttpMethods(State.class, config, theUnsuportedActions);

        //disalbe http method for country : put, post and delete

        disableHttpMethods(Country.class, config, theUnsuportedActions);

        // call internal helper method to expose id's

        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsuportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        //expose entity ids

        // get a list of all entity classes from the entity manager

        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of the entity types

        List<Class> entityClasses = new ArrayList<>();

        // get enitty type for the entities

        for(EntityType tempEntityType : entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        // expose entity ids for the array of entity/domain types

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
