import { Handler } from "express";
import { DIRequest, initContainer } from "./di";
import {
  OnDocumentCreatedHandler,
  OnDocumentCreatedHandlerFactory,
} from "./handlers";

export const dIExpressMiddleware: Handler = (req, res, next) => {
  // initialize container
  const container = initContainer();

  // attach container to request object
  (req as DIRequest).container = container;

  next();
};

export const dIDocumentCreatedMiddleware: (
  handler: OnDocumentCreatedHandlerFactory
) => OnDocumentCreatedHandler = (handler) => {
  return (event) => handler(initContainer())(event);
};
