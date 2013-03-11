var storage = {
	init:function(params){

		var self = this;

		_.extend(self,params);
		
		var db = this.db = WebSQL(this.db_name);

		this._remove_private();
		
		return this;
	},
	create_tables:function(){
		var self = this;
		_.each(this.models,function(Model,tbname){
			self.db.query(self.create_table_sql(tbname,Model));
		});
	},
	create_index:function(tbname,column){
		this.db.query(this.create_index_sql(tbname,column));
	},
	get:function(tbname,id,callback){
		if(id){
			var SQL = ['SELECT * FROM',tbname,'WHERE id=?'].join(' ');
			console.log(SQL);
			this.db.query(SQL,[id]).fail(function (tx, err) {
    			throw new Error(err.message);
			}).done(function(rows){
				if(callback){
					callback(rows,tbname,id);
				}
			});
		}
	},
	remove:function(tbname,id,callback){
		var self = this;
		if(id){
			var SQL = ['DELETE FROM',tbname,'WHERE id=?'].join(' ');
			console.log(SQL);
			this.db.query(SQL,[id]).fail(function (tx, err) {
    			throw new Error(err.message);
			}).done(function(){
				if(callback){
					callback.apply(self,arguments);
				}
			});;
		}
	},
	save:function(tbname,model,remove){
		if(!model)return;
		var self = this;
		if(self._is_collection(model)){
			_.each(model.models,function(value,key){
				self.save(tbname,value,remove);
			});
		}else{
			var id = model.get('id');
			self.get(tbname,id,function(exist){
				var data = self._model_to_array(model);
				if(exist && exist.length>0 && remove){
					self.remove(tbname,id,function(){
						self.db.query(self.insert_table_sql(tbname),data);
					});
				}else{
					self.db.query(self.insert_table_sql(tbname),data);					
				}
			});
		}
	},
	query:function(){},
	update:function(){},
	create_table_sql:function(tbname){
		var Model = this.models[tbname];
		var SQL = ['CREATE TABLE',tbname,this._list_all_params(Model,',')].join(' ');
		console.log(SQL);
		return SQL;
	},
	insert_table_sql:function(tbname){
		var Model = this.models[tbname];
		var SQL = ["INSERT INTO",tbname,this._list_all_params(Model,','),'VALUES',this._list_all_params(Model,',',true)].join(' ');
		console.log(SQL);
		return SQL;
	},
	create_index_sql:function(tbname,colname){
		var index_name = ['index_',tbname,'_',colname].join('');
		var SQL  = ['CREATE INDEX',index_name,'ON',tbname,'(',colname,')'].join(' ');
		console.log(SQL);
		return SQL;
	},
	_get_model_attr:function(Model){
		if (!Model) {
			console.error("Model is undefined!");
		};
		var model = new Model();
		return model.attributes;
	},
	_list_all_params:function(Model,separator,filled){
		var params = [];
		var fill = [];
		_.each(this._get_model_attr(Model),function(value,key){
			params.push(key);
			fill.push('?');
		});
		return '( '+(filled?fill:params).join(' '+separator+' ')+" )";
	},
	_model_to_array:function(target){
		var self = this;
		var array = [];
		if(self._is_collection(target)){//Collection
			_.each(target.models,function(value,key){
				array.push(self._model_to_array(value));
			});
		}else{//Single Model
			_.each(target.attributes,function(value,key){
				array.push(value);
			});
		}
		return array;
	},
	_is_collection:function(target){
		return target.models;
	},
	_remove_private:function(){
		var self = this;
		delete this.init;
		_.each(this,function(value,key){
			if(_.indexOf(key,'_')==0){
				delete self[key];
			}
		});
	}
};